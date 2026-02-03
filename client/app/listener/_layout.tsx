import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ListenerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTitleStyle: {
          fontFamily: 'amiri-regular',
        },
        headerTintColor: '#333',
        animation: Platform.select({
          web: 'none',
          default: 'default',
        }),
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: 'Available Books',
        }}
      />
      <Stack.Screen
        name="player"
        options={{
          title: 'Audio Player',
        }}
      />
    </Stack>
  );
} 