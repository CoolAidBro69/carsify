// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FREBASE_API_KEY,
  authDomain: "mern-project-493dd.firebaseapp.com",
  projectId: "mern-project-493dd",
  storageBucket: "mern-project-493dd.appspot.com",
  messagingSenderId: "513665257987",
  appId: "1:513665257987:web:ef9d02c98fc745aec47436",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
