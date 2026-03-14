import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

type Book = {
  id: number;
  title: string;
  author: string | null;
  language: string;
  is_public_domain: boolean;
};

export default function EnglishBooksScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author, language, is_public_domain')
      .eq('language', 'en')
      .eq('is_public_domain', true)
      .order('title');

    if (error) {
      setBooks([]);
      setErrorMsg(error.message);
    } else {
      setBooks(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading English books…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Failed to load books</Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>{errorMsg}</Text>
        <TouchableOpacity onPress={load} style={{ padding: 12, backgroundColor: '#3f51b5', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={books.length === 0 ? { flex: 1 } : undefined}
      ListEmptyComponent={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>No English books found</Text>
          <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>
            Check that your Supabase rows have language = 'en' and is_public_domain = true.
          </Text>
          <TouchableOpacity onPress={load} style={{ padding: 12, backgroundColor: '#3f51b5', borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Refresh</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/listener/player', params: { bookId: item.id, lang: 'en' } })}
          style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ddd' }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
          {!!item.author && <Text style={{ marginTop: 4, color: '#666' }}>{item.author}</Text>}
        </TouchableOpacity>
      )}
    />
  );
}

