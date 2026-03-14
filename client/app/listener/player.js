import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AudioPlayer from '../../components/AudioPlayer';

export default function Player() {
  const { bookId, all } = useLocalSearchParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAll, setShowAll] = useState(all === '1');

  useEffect(() => {
    const raw = Array.isArray(bookId) ? bookId[0] : bookId;
    const parsedBookId = raw ? Number(raw) : NaN;
    if (!raw || Number.isNaN(parsedBookId)) {
      setErrorMsg('Invalid book id.');
      setChapters([]);
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      let q = supabase
        .from('chapters')
        .select('id, book_id, chapter_number, title, audio_url, status, created_at')
        .eq('book_id', parsedBookId)
        .order('chapter_number');
      if (!showAll) q = q.eq('status', 'approved');
      const { data, error } = await q;
      if (error) {
        setChapters([]);
        setErrorMsg(error.message);
      } else {
        setChapters(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, [bookId, showAll]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading chapters…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Failed to load chapters</Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>{errorMsg}</Text>
        <TouchableOpacity onPress={() => setShowAll(v => v)} style={{ padding: 12, backgroundColor: '#333', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <TouchableOpacity
          onPress={() => setShowAll(v => !v)}
          style={{ padding: 10, backgroundColor: showAll ? '#ff9800' : '#4CAF50', borderRadius: 8, alignSelf: 'flex-start' }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {showAll ? 'Showing: all chapters' : 'Showing: approved only'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={chapters}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={chapters.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>No chapters found</Text>
            <Text style={{ color: '#666', textAlign: 'center' }}>
              {showAll
                ? 'Add chapters for this book in Supabase.'
                : 'No approved chapters yet. Tap the toggle above to show all chapters.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              Chapter {item.chapter_number}
              {item.title ? ` — ${item.title}` : ''}
            </Text>
            {!!item.status && <Text style={{ marginTop: 4, color: '#666' }}>Status: {item.status}</Text>}
            {!!item.audio_url ? (
              <View style={{ marginTop: 10 }}>
                <AudioPlayer audioUrl={item.audio_url} />
              </View>
            ) : (
              <Text style={{ marginTop: 8, color: '#999' }}>No audio URL for this chapter.</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}