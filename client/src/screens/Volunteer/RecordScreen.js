import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../../lib/supabase';
import { uploadAudio } from '../../lib/firebase';
import { useLocalSearchParams } from 'expo-router'; 

export default function RecordScreen() {
  const [recording, setRecording] = useState(null);
  const { bookId, chapterNumber } = useLocalSearchParams(); 

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission denied', 'Audio recording permission is required.');
        return;
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
      console.error('Start recording error:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const audioUrl = await uploadAudio(uri, `books/${bookId}/chapter_${chapterNumber}.mp3`);

      const { error } = await supabase.from('chapters').insert([
        {
          book_id: bookId,
          chapter_number: parseInt(chapterNumber), // ✅ ensure it's a number
          audio_url: audioUrl,
          narrator_id: supabase.auth.getUser?.()?.id || null,
          status: 'pending',
        },
      ]);

      if (error) {
        Alert.alert('Error', 'Database insertion failed');
        console.error('Insert error:', error);
      } else {
        Alert.alert('Success', 'Chapter uploaded for review');
      }
    } catch (err) {
      Alert.alert('Error', 'Upload failed');
      console.error('Stop recording error:', err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}
