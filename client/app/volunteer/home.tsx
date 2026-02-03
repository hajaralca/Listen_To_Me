import { View, Text, StyleSheet } from 'react-native';

export default function VolunteerHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volunteer Dashboard</Text>
      <Text style={styles.message}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
  },
}); 