// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAFRGQbFIX4DTg4-tBKI7bN-4S_27VHoik",
    authDomain: "tt-cup.firebaseapp.com",
    projectId: "tt-cup",
    storageBucket: "tt-cup.firebasestorage.app",
    messagingSenderId: "124706973988",
    appId: "1:124706973988:web:5e9ac6cbc4f6342c43ebb1",
    measurementId: "G-5T7E45CE26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const auth = getAuth(app);
