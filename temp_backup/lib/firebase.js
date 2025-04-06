import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBexc2p_5GK-aXHK4tRIB2NLhcrY8c8j-0",
    authDomain: "listentome-1de0d.firebaseapp.com",
    projectId: "listentome-1de0d",
    storageBucket: "listentome-1de0d.firebasestorage.app",
    messagingSenderId: "820908807670",
    appId: "1:820908807670:web:7048992aeab0939905e3d7",
    measurementId: "G-YZDDPC2MXN"
  };  

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Upload audio to Firebase Storage
export const uploadAudio = async (uri, path) => {
  const blob = await (await fetch(uri)).blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
};