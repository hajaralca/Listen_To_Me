import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "mock-key-for-testing",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:mock",
  measurementId: "G-MOCK"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// MOCK UPLOAD FUNCTION - NO REAL FIREBASE NEEDED
export const uploadAudio = async (uri, path) => {
  console.log("🎬 MOCK UPLOAD ACTIVATED - No Firebase billing needed!");
  console.log("Local file:", uri);
  console.log("Would upload to:", path);
  
  // Simulate 2-second upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return fake Firebase URL
  const fakeUrl = `https://firebasestorage.googleapis.com/v0/b/mock-bucket.appspot.com/o/${encodeURIComponent(path)}?alt=media`;
  
  console.log("✅ Mock upload complete:", fakeUrl);
  return fakeUrl;
};