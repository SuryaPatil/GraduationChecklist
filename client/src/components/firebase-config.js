// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOkVUUh0g9-FrQD56B4k2oxWNWKh8xpAc",
  authDomain: "graduationchecklist.firebaseapp.com",
  projectId: "graduationchecklist",
  storageBucket: "graduationchecklist.appspot.com",
  messagingSenderId: "256833049356",
  appId: "1:256833049356:web:d9381ca28daeda0413ef29",
  measurementId: "G-90YRKTMV5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)