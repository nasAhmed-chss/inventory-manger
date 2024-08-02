// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_z0AXzDkDZZ31UlxCXpw8BppWMm4kq5s",
    authDomain: "inventory-management-a5aee.firebaseapp.com",
    projectId: "inventory-management-a5aee",
    storageBucket: "inventory-management-a5aee.appspot.com",
    messagingSenderId: "816495191579",
    appId: "1:816495191579:web:2c62a99676decdb8683abe",
    measurementId: "G-P9QFF4800J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }