import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ExpoAV from 'expo-av';
import { supabase } from '../../lib/supabase';
import { uploadAudio } from '../../lib/firebase';
import { useAuth, canRecord } from '../../lib/auth-context';

type Book = { id: number; title: string; author?: string; language: string };
type ChapterRow = { chapter_number: number; status: string };
type ChapterOption = { chapter_number: number; status: 'claimable' | 'pending' | 'approved' };

const MAX_CHAPTERS = 50;

export default function RecordScreen() {
  const router = useRouter();
  const { user, role, loading: authLoading, signOut } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [chaptersByBook, setChaptersByBook] = useState<ChapterRow[]>([]);
  const [isChaptersLoading, setIsChaptersLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | null>(null);
  const [recording, setRecording] = useState<ExpoAV.Audio.Recording | null>(null);
  const [recordedFileUri, setRecordedFileUri] = useState<string | null>(null);
  const [recordErrorMsg, setRecordErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/volunteer/sign-in');
      return;
    }
    if (!canRecord(role)) return;
  }, [authLoading, user, role, router]);

  useEffect(() => {
    const loadBooks = async () => {
      setBooksLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, language')
        .eq('is_public_domain', true)
        .order('title');
      if (!error) setBooks(data ?? []);
      setBooksLoading(false);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBookId == null) {
      setChaptersByBook([]);
      return;
    }
    const loadChapters = async () => {
      setIsChaptersLoading(true);
      const { data, error } = await supabase
        .from('chapters')
        .select('chapter_number, status')
        .eq('book_id', selectedBookId)
        .order('chapter_number');
      if (!error) setChaptersByBook(data ?? []);
      setIsChaptersLoading(false);
    };
    loadChapters();
  }, [selectedBookId]);

  const chapterOptions: ChapterOption[] = (() => {
    const existing = new Map(chaptersByBook.map(c => [c.chapter_number, c.status as 'pending' | 'approved' | 'rejected']));
    const maxN = Math.max(MAX_CHAPTERS, ...chaptersByBook.map(c => c.chapter_number), 1);
    const list: ChapterOption[] = [];
    for (let n = 1; n <= maxN; n++) {
      const status = existing.get(n);
      if (status === 'approved') list.push({ chapter_number: n, status: 'approved' });
      else if (status === 'pending') list.push({ chapter_number: n, status: 'pending' });
      else list.push({ chapter_number: n, status: 'claimable' });
    }
    return list;
  })();

  const selectBook = (bookId: number) => {
    setSelectedBookId(bookId);
    setSelectedChapterNum(null);
  };

  const selectChapter = (chapterNum: number) => {
    const opt = chapterOptions.find(c => c.chapter_number === chapterNum);
    if (opt?.status === 'claimable') setSelectedChapterNum(chapterNum);
  };

  const getSelectedBookTitle = () => {
    if (selectedBookId == null) return 'None';
    const book = books.find(b => b.id === selectedBookId);
    return book ? book.title : 'None';
  };

  // --- Recording: permissions, start, stop, file URI ---

  const ensureRecordingPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await ExpoAV.Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setRecordErrorMsg('Microphone permission is required to record.');
        Alert.alert('Permission required', 'Please allow microphone access in settings to record.');
        return false;
      }
      await ExpoAV.Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      setRecordErrorMsg(null);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to request permissions';
      setRecordErrorMsg(message);
      Alert.alert('Error', message);
      return false;
    }
  };

  const startRecording = async () => {
    if (selectedBookId == null || selectedChapterNum == null) return;
    if (!(await ensureRecordingPermissions())) return;
    try {
      const { recording: newRec } = await ExpoAV.Audio.Recording.createAsync(
        ExpoAV.Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRec);
      setRecordedFileUri(null);
      setRecordErrorMsg(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to start recording';
      setRecordErrorMsg(message);
      Alert.alert('Error', message);
    }
  };

  const stopRecording = async () => {
    const current = recording;
    const bookId = selectedBookId;
    const chapterNum = selectedChapterNum;
    if (!current || bookId == null || chapterNum == null) return;
    try {
      await current.stopAndUnloadAsync();
      const fileUri = current.getURI() ?? null;
      setRecordedFileUri(fileUri);
      setRecording(null);
      setRecordErrorMsg(null);

      if (!fileUri) return;

      setIsUploading(true);
      setRecordErrorMsg(null);
      const storagePath = `recordings/${bookId}/chapter_${chapterNum}.mp3`;
      const audioUrl = await uploadAudio(fileUri, storagePath);

      const narratorId = user?.id ?? null;

      const { data: existing } = await supabase
        .from('chapters')
        .select('id')
        .eq('book_id', bookId)
        .eq('chapter_number', chapterNum)
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { error: updateErr } = await supabase
          .from('chapters')
          .update({
            audio_url: audioUrl,
            status: 'pending',
            narrator_id: narratorId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from('chapters').insert({
          book_id: bookId,
          chapter_number: chapterNum,
          audio_url: audioUrl,
          status: 'pending',
          narrator_id: narratorId,
        });
        if (insertErr) throw insertErr;
      }

      setRecordedFileUri(null);
      Alert.alert('Success', 'Chapter uploaded for review.');
      setIsChaptersLoading(true);
      const { data, error } = await supabase
        .from('chapters')
        .select('chapter_number, status')
        .eq('book_id', bookId)
        .order('chapter_number');
      if (!error) setChaptersByBook(data ?? []);
      setIsChaptersLoading(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload or save failed';
      setRecordErrorMsg(message);
      Alert.alert('Error', message);
      setRecording(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordPress = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  if (!canRecord(role)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Volunteer access only</Text>
        <Text style={styles.message}>
          Your account does not have volunteer access. Role: {role ?? 'none'}. Contact an admin.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => signOut().then(() => router.replace('/volunteer/sign-in'))}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.replace('/')}>
          <Text style={styles.buttonTextSecondary}>Back to home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Record Chapter</Text>
        <Text style={styles.subtitle}>Help others by recording an audiobook chapter</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select a Book</Text>
        {booksLoading ? (
          <ActivityIndicator size="small" style={styles.loader} />
        ) : books.length === 0 ? (
          <Text style={styles.emptyText}>No books available.</Text>
        ) : (
          books.map(book => (
            <TouchableOpacity
              key={book.id}
              style={[styles.selectionItem, selectedBookId === book.id && styles.selectedItem]}
              onPress={() => selectBook(book.id)}
            >
              <Text style={styles.itemText}>{book.title}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {selectedBookId != null && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Chapter (claimable only)</Text>
          {isChaptersLoading ? (
            <ActivityIndicator size="small" style={styles.loader} />
          ) : (
            chapterOptions.map(opt => {
              const isClaimable = opt.status === 'claimable';
              const isSelected = selectedChapterNum === opt.chapter_number;
              return (
                <TouchableOpacity
                  key={opt.chapter_number}
                  style={[
                    styles.selectionItem,
                    isSelected && styles.selectedItem,
                    opt.status === 'approved' && styles.chapterDone,
                    opt.status === 'pending' && styles.chapterPending,
                  ]}
                  onPress={() => selectChapter(opt.chapter_number)}
                  disabled={!isClaimable}
                >
                  <Text style={[styles.itemText, !isClaimable && styles.itemTextMuted]}>
                    Chapter {opt.chapter_number}
                    {opt.status === 'approved' && ' ✓'}
                    {opt.status === 'pending' && ' (pending)'}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      <View style={styles.recordingInfo}>
        <Text style={styles.bookTitle}>Selected Book: {getSelectedBookTitle()}</Text>
        <Text style={styles.chapterInfo}>
          Chapter: {selectedChapterNum != null ? `Chapter ${selectedChapterNum}` : 'Not selected'}
        </Text>
        {recordedFileUri != null && (
          <Text style={styles.uriText} numberOfLines={2}>
            Last file: {recordedFileUri}
          </Text>
        )}
        {recordErrorMsg != null && (
          <Text style={styles.errorText}>{recordErrorMsg}</Text>
        )}
      </View>

      {selectedBookId != null && selectedChapterNum != null && (
        <>
          {isUploading && (
            <View style={styles.uploadingRow}>
              <ActivityIndicator size="small" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.recordButton, recording != null && styles.recordingActive]}
            onPress={handleRecordPress}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>
              {recording != null ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    minWidth: 200,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonTextSecondary: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  selectionItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  chapterDone: {
    borderColor: '#9e9e9e',
    backgroundColor: '#f5f5f5',
  },
  chapterPending: {
    borderColor: '#FFC107',
    backgroundColor: '#FFF8E1',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemTextMuted: {
    color: '#999',
  },
  loader: {
    marginVertical: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  recordingInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  chapterInfo: {
    fontSize: 16,
    color: '#666',
  },
  uriText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 8,
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
    color: '#666',
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingActive: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 