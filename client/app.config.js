// app.config.js
import 'dotenv/config';

const appJson = require('./app.json');

export default {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
