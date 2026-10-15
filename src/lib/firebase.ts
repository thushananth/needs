// Firebase app initialization
// SDK: firebase@^10 (modular)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAveV3GqTtFraNvLTnDsv783CiKWu0v43o',
  authDomain: 'need-99bda.firebaseapp.com',
  projectId: 'need-99bda',
  storageBucket: 'need-99bda.firebasestorage.app',
  messagingSenderId: '284818074393',
  appId: '1:284818074393:web:81471561a6e5b139f37388',
  measurementId: 'G-139XDTJ6XY',
};

// Avoid duplicate initialisation in Next.js hot-reload environment
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Analytics is browser-only; initialise lazily so SSR doesn't break
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}

export default app;
