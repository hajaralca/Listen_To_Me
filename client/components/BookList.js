import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function BookList({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_public_domain', true);
      if (!error) setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 15 }}
          onPress={() => navigation.navigate('PlayerScreen', { bookId: item.id })}
        >
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text style={{ color: 'gray' }}>{item.author}</Text>
        </TouchableOpacity>
      )}
    />
  );
}