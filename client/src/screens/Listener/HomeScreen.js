import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import BookCard from '../../components/BookCard';  
export default function HomeScreen() {
  const [arabicBooks, setArabicBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('language', 'ar')
        .eq('is_public_domain', true);
      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setArabicBooks(data);
      }
    };
    fetchBooks();
  }, []);

  return (
    <FlatList
      data={arabicBooks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <BookCard
          book={item}
          onPress={() =>
            router.push({
              pathname: '/listener/player',
              params: { bookId: item.id }
            })
          }
        />
      )}
    />
  );
}
