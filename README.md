# Listen To Me

My lovely audiobook app built with **Expo (React Native)**. Listeners browse and play audiobook chapters; volunteers sign in, choose a book, and record chapters. Data and auth are powered by **Supabase**; audio files are stored in **Firebase Storage**.

---

## Features

- **Listener**
  - Choose **Arabic Books** or **English Books** from the home menu.
  - Browse books (filtered by language and public domain).
  - Open a book to see its chapters.
  - Play/pause audio and scrub with a progress slider.

- **Volunteer**
  - Sign in with email/password (Supabase Auth).
  - Access is restricted to users with role `volunteer` or `admin` in `user_roles`.
  - Select a book and a claimable chapter, then record with the device microphone.
  - On stop: upload audio to Firebase Storage and save/update a row in `chapters` .

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | Expo (React Native), Expo Router, expo-av |
| Database & Auth | Supabase (PostgreSQL, PostgREST, Auth) |
| File Storage | Firebase Storage |
| Audio       | expo-av (playback + recording) |

---
## Prerequisites

- **Node.js** (LTS, e.g. 20+)
- **npm** or **yarn**
- **Expo Go** on your phone, or **Android Studio** / **Xcode** for emulators
- **Supabase** project ([supabase.com](https://supabase.com))
- **Firebase** project ([console.firebase.google.com](https://console.firebase.google.com)) with Storage (and optional Auth) enabled

---

## Setup
**Coming soon !**
Emm, I’m not sharing the secret sauce until the recipe is actually finished. 

---

## Run the app

From `client/`:

```bash
# Start Expo dev server
npm start
# or
npx expo start

# Then: scan QR with Expo Go, or press:
#   a — Android
#   i — iOS
#   w — Web
```

Or use the scripts:

```bash
npm run android   # Opens Android emulator / device
npm run ios       # Opens iOS simulator
npm run web       # Opens in browser
```

---


## APIs / SDKs used

- **Supabase JS** (`@supabase/supabase-js`): database (PostgREST) and Auth.
- **Firebase** (`firebase`): Storage only (upload audio, get download URL).
- **expo-av**: record and play audio.
- **Expo Router**: file-based routing.

---

## License

Private / unlicensed unless stated otherwise.
