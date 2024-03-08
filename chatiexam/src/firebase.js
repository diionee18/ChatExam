import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD2QF_vemZX80hGsAWYKF0fkvomgVCjY78",
    authDomain: "chatii-exam.firebaseapp.com",
    projectId: "chatii-exam",
    storageBucket: "chatii-exam.appspot.com",
    messagingSenderId: "137459509566",
    appId: "1:137459509566:web:e5319ffb1a21dc1667a46f",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();