// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7UNtGn58dT9Bs-n33ZlhaC9Og7HEvr-g",
  authDomain: "sproutsg-b6860.firebaseapp.com",
  projectId: "sproutsg-b6860",
  storageBucket: "sproutsg-b6860.appspot.com",
  messagingSenderId: "717571379088",
  appId: "1:717571379088:web:d272177adf82ff71a4ad15"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);