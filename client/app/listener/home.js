import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ListenerHome() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('language', 'ar')
        .eq('is_public_domain', true);
      if (error) {
        setBooks([]);
        setErrorMsg(error.message);
      } else {
        setBooks(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading Arabic books…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Failed to load books</Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>{errorMsg}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setErrorMsg(null);
            supabase
              .from('books')
              .select('*')
              .eq('language', 'ar')
              .eq('is_public_domain', true)
              .then(({ data, error }) => {
                if (error) setErrorMsg(error.message);
                else setBooks(data ?? []);
              })
              .finally(() => setLoading(false));
          }}
          style={{ padding: 12, backgroundColor: '#ff4444', borderRadius: 8 }}
        >
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
          <Text style={{ fontSize: 18, marginBottom: 8 }}>No Arabic books found</Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>
            Add books with language = 'ar' and is_public_domain = true in Supabase.
          </Text>
        </View>
      }
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