import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const PINK = '#E91E63';
const AZUL = '#2196F3';

export default function ListenerMenu() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Listener</Text>
        <Text style={styles.subtitle}>Choose a library</Text>

        <Link href="/listener/home" asChild>
          <TouchableOpacity activeOpacity={0.85} accessibilityRole="button">
            <View style={[styles.button, styles.arabicBg]}>
              <Text style={styles.buttonText}>Arabic Books</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/listener/english" asChild>
          <TouchableOpacity activeOpacity={0.85} accessibilityRole="button">
            <View style={[styles.button, styles.englishBg]}>
              <Text style={styles.buttonText}>English Books</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  arabicBg: {
    backgroundColor: PINK,
  },
  englishBg: {
    backgroundColor: AZUL,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

