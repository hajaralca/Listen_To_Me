import { registerRootComponent } from 'expo';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import { useEffect } from 'react';
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './lib/supabase';
import * as Font from 'expo-font';
import AuthGate from './components/AuthGate';
import BookList from './components/BookList';
import PlayerScreen from './screens/Listener/PlayerScreen';
import RecordScreen from './screens/Volunteer/RecordScreen';

const Stack = createStackNavigator();

function MainApp() {
  // Initialize Firebase Auth
  useEffect(() => {
    signInAnonymously(auth)
      .then(() => console.log("Firebase connected!"))
      .catch((error) => console.error("Firebase error:", error));
  }, []);

  // Load custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'amiri-regular': require('./assets/fonts/Amiri-Regular.ttf'),
        'amiri-bold': require('./assets/fonts/Amiri-Bold.ttf'),
      });
    };
    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
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

// Register the app root component
registerRootComponent(MainApp);

// registerRootComponent(App);
