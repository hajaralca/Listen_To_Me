import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function VolunteerLayout() {
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
        name="sign-in"
        options={{
          title: 'Sign in',
        }}
      />
      <Stack.Screen
        name="record"
        options={{
          title: 'Record Chapter',
        }}
      />
    </Stack>
  );
} 