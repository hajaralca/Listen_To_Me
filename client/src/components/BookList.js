// src/components/BookList.js
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_public_domain', true);

      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setBooks(data);
      }
    };

    fetchBooks();
  }, []);

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}
          onPress={() =>
            router.push({
              pathname: '/listener/player',
              params: { bookId: item.id }
            })
          }
        >
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text style={{ color: 'gray' }}>{item.author}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
