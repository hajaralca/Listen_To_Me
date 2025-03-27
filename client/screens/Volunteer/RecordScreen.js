import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '../../lib/supabase';
import { uploadAudio } from '../../lib/firebase';

export default function RecordScreen({ route }) {
  const [recording, setRecording] = useState();
  const { bookId, chapterNumber } = route.params;

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      const audioUrl = await uploadAudio(
        uri,
        `books/${bookId}/chapter_${chapterNumber}.mp3`
      );

      await supabase.from('chapters').insert([
        {
          book_id: bookId,
          chapter_number: chapterNumber,
          audio_url: audioUrl,
          narrator_id: supabase.auth.user().id,
          status: 'pending'
        }
      ]);

      Alert.alert('Success', 'Chapter uploaded for review');
    } catch (err) {
      Alert.alert('Error', 'Upload failed');
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