import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AudioPlayer from '../../components/AudioPlayer';

export default function PlayerScreen() {
  const { bookId } = useLocalSearchParams(); 
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!bookId) return;

    const fetchChapters = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true });

      if (error) {
        console.error('Error fetching chapters:', error);
      } else {
        setChapters(data);
      }
    };

    fetchChapters();
  }, [bookId]);

  return (
    <View style={{ padding: 20 }}>
      {chapters.length === 0 ? (
        <Text>Loading chapters...</Text>
      ) : (
        chapters.map((chapter) => (
          <View key={chapter.id} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Chapter {chapter.chapter_number}
            </Text>
            <AudioPlayer audioUrl={chapter.audio_url} />
          </View>
        ))
      )}
    </View>
  );
}
