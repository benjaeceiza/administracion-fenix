
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-3mcCLKTQwFr0ZL3X2DI4aNxb2x_-BWo",
  authDomain: "administracion-fenix.firebaseapp.com",
  projectId: "administracion-fenix",
  storageBucket: "administracion-fenix.appspot.com",
  messagingSenderId: "421833575705",
  appId: "1:421833575705:web:6ea6b0819d65cd40288988"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(<App />
 
)
