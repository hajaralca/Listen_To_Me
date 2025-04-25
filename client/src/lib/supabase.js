// src/lib/supabase.js
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

// Pull values from app.config.js → expo.extra
// Expo SDK 48+ uses Constants.expoConfig, earlier uses Constants.manifest
const {
  supabaseUrl,
  supabaseAnonKey,
} = (Constants.manifest || Constants.expoConfig).extra || {};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('supabaseUrl is required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    heartbeatIntervalMs: 10000,
  },
});

// Helper for auth state changes
export const onAuthStateChange = (callback) =>
  supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
