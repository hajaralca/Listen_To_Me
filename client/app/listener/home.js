import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ListenerHome() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('language', 'ar')
        .eq('is_public_domain', true);
      if (!error) setBooks(data);
    };
    load();
  }, []);

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/listener/player', params: { bookId: item.id } })}
          style={{ padding: 20, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}