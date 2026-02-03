import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if environment variables are set
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing Firebase config: ${key} is not set`);
  }
});

let auth: Auth;

try {
  console.log('Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  auth = getAuth(app);
  
  // Add auth state change listener
  onAuthStateChanged(auth, (user) => {
    console.log('Firebase auth state changed:', user ? 'User signed in' : 'No user');
    if (user) {
      console.log('User ID:', user.uid);
    }
  });

} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { auth }; 