"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAJeixHjFy1XRCrQig0_RgfipAEGRBHiSw",
//   authDomain: "caregiver-b392d.firebaseapp.com",
//   projectId: "caregiver-b392d",
//   storageBucket: "caregiver-b392d.appspot.com",
//   messagingSenderId: "914091904669",
//   appId: "1:914091904669:web:fea77838b8f9f43a6bce74"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBStTsMwHqaC9DmNlPH01zsR1JHHMeCcYE",
  authDomain: "sathee-a4480.firebaseapp.com",
  databaseURL:
    "https://sathee-a4480-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sathee-a4480",
  storageBucket: "sathee-a4480.firebasestorage.app",
  messagingSenderId: "29576035035",
  appId: "1:29576035035:web:320b98bb6ed199e5732afe",
  measurementId: "G-FP5J98MTGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
