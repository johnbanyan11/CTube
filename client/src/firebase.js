import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "clone-mern-aaef4.firebaseapp.com",
  projectId: "clone-mern-aaef4",
  storageBucket: "clone-mern-aaef4.appspot.com",
  messagingSenderId: "58516045933",
  appId: "1:58516045933:web:861ae5e48567efe9f27f64",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;
