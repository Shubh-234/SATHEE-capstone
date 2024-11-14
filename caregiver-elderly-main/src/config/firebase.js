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
  apiKey: "AIzaSyDbJzIZEIuVXR19tjnE52bav0ZAxtpgf60",
  authDomain: "sathee-da58e.firebaseapp.com",
  projectId: "sathee-da58e",
  storageBucket: "sathee-da58e.firebasestorage.app",
  messagingSenderId: "767619976613",
  appId: "1:767619976613:web:6954cf606726e3fa6b2c4c",
  measurementId: "G-73LQ4R3HDQ",
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
