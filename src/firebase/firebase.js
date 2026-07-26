import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCq8sgglFnxcnBHEmoMbjWsP2H_dcZzxB0",
  authDomain: "ai-interview-coach-c49d8.firebaseapp.com",
  projectId: "ai-interview-coach-c49d8",
  storageBucket: "ai-interview-coach-c49d8.firebasestorage.app",
  messagingSenderId: "404961938732",
  appId: "1:404961938732:web:31d20641fbb0c4e154b089",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);