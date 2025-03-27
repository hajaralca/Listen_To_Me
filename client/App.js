import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './lib/supabase';
import AuthGate from './components/AuthGate';
import BookList from './components/BookList';
import PlayerScreen from './screens/Listener/PlayerScreen';
import RecordScreen from './screens/Volunteer/RecordScreen';

// Test Firebase Auth
useEffect(() => {
  signInAnonymously(auth)
    .then(() => console.log("Firebase connected!"))
    .catch((error) => console.error("Firebase error:", error));
}, []);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthGate">
        <Stack.Screen
          name="AuthGate"
          component={AuthGate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookList"
          component={BookList}
          options={{ title: 'Available Books' }}
        />
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={{ title: 'Audiobook Player' }}
        />
        <Stack.Screen
          name="RecordScreen"
          component={RecordScreen}
          options={{ title: 'Record Chapter' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}