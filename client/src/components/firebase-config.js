// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRtzvycbrbwVuvq4sVkGxRqNIE6sqnstk",
  authDomain: "readtranscript-2fac0.firebaseapp.com",
  projectId: "readtranscript-2fac0",
  storageBucket: "readtranscript-2fac0.appspot.com",
  messagingSenderId: "421056651356",
  appId: "1:421056651356:web:3a2c77da90edcf86fa4699",
  measurementId: "G-WTY4RB6MWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db  = getFirestore()