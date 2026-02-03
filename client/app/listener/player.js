import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AudioPlayer from '../../components/AudioPlayer';

export default function Player() {
  const { bookId } = useLocalSearchParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!bookId) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number');
      if (!error) setChapters(data);
    };
    load();
  }, [bookId]);

  return (
    <View style={{ padding: 20 }}>
      {chapters.map(chap => (
        <View key={chap.id} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16 }}>Chapter {chap.chapter_number}</Text>
          <AudioPlayer audioUrl={chap.audio_url} />
        </View>
      ))}
    </View>
  );
}