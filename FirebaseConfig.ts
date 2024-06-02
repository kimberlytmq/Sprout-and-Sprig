// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
//@ts-ignore
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);