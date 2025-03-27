import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

export default function UploadScreen() {
  const [bookId, setBookId] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!bookId || !chapterNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Validate book exists
    const { data: book, error } = await supabase
      .from('books')
      .select('id, title')
      .eq('id', bookId)
      .single();

    if (error || !book) {
      Alert.alert('Error', 'Book not found');
      return;
    }

    navigation.navigate('RecordScreen', { 
      bookId,
      chapterNumber: parseInt(chapterNumber),
      bookTitle: book.title
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Book ID"
        value={bookId}
        onChangeText={setBookId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Chapter Number"
        value={chapterNumber}
        onChangeText={setChapterNumber}
        keyboardType="numeric"
      />
      <Button 
        title="Continue to Recording" 
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  }
});