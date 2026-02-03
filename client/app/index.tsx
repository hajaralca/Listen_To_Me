import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listen To Me</Text>
      
      <Link href="/listener/home" asChild>
        <TouchableOpacity 
          style={[styles.button, styles.listenerButton]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>listener</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/volunteer/sign-in" asChild>
        <TouchableOpacity 
          style={[styles.button, styles.volunteerButton]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>volunteer</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  listenerButton: {
    backgroundColor: '#ff4444',
  },
  volunteerButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 