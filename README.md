# Preamar — Recipe Costing (MVP)

Vite + React + TypeScript + Tailwind. Firebase (Auth, Firestore, Storage). GitHub Pages hosting.  
Default currency: **GBP**. Units: **metric** (kg, g, L, ml) with **imperial** optional.

### Mobile-first
This starter ships with a mobile-friendly top nav (hamburger on small screens), larger tap targets, and sticky header — tested on iPhone/iPad sizes.

## Quick start
```bash
npm i
cp .env.example .env.local  # create and fill with your Firebase web config
npm run dev
```

Create `.env.local` with:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Firebase Emulators (optional)
```bash
npm i -g firebase-tools
firebase login
firebase init emulators   # pick Auth, Firestore, Storage
firebase emulators:start
```
To point the app to emulators during local dev, add to `src/lib/firebase.ts`:
```ts
import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { connectStorageEmulator } from 'firebase/storage'

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}
```

### Build & Deploy (GitHub Pages)
1) Push to `main`.  
2) Action builds and publishes `dist` to `gh-pages`.  
3) Enable Pages → Deploy from branch → `gh-pages`.

### Data model & costing
- Ingredients (pack, price, measurements, wastage) → cost per usage unit with wastage uplift.
- Preparations (yield, items) → cost per net unit.
- Dishes (items, selling price) → cost per portion, Food Cost %, Profit.
- Menus (entries, people) → price per person.
- Events (menu, guests, extras) → total GP%.

### Security
Rules enforce per-user isolation via `ownerId`. Users only read/write their own `/users/{uid}`.

### Tests
```bash
npm test
```
