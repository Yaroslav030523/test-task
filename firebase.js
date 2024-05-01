
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKGnCz1laqksvyatx2El1-TJACQxkBYsE",
  authDomain: "v-task-421809.firebaseapp.com",
  databaseURL: "https://v-task-421809-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "v-task-421809",
  storageBucket: "v-task-421809.appspot.com",
  messagingSenderId: "1022629706248",
  appId: "1:1022629706248:web:e3b43203e638a40596efbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);