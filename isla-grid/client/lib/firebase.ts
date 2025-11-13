// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjYJYOIPAza3CvsB_KJmmfbsxrakvLIcw",
  authDomain: "islagrid.firebaseapp.com",
  projectId: "islagrid",
  storageBucket: "islagrid.firebasestorage.app",
  messagingSenderId: "7561061719",
  appId: "1:7561061719:web:34e81d455dbb3898788a12",
  measurementId: "G-J8M0Z84F73",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
