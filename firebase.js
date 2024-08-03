// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMCv3JI7qOsi-XnOFQbVdWNqpC1Elk2hg",
  authDomain: "pantry-items-ae82b.firebaseapp.com",
  projectId: "pantry-items-ae82b",
  storageBucket: "pantry-items-ae82b.appspot.com",
  messagingSenderId: "241867384682",
  appId: "1:241867384682:web:1c20871ee408366b856713",
  measurementId: "G-M62RXRR661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};