// src/components/BookCard.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function BookCard({ book, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 18 }}>{book.title}</Text>
      <Text style={{ color: 'gray' }}>{book.author}</Text>
    </TouchableOpacity>
  );
}
