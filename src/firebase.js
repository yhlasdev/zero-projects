import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBEW58FfVbVNXQJ6MtTc63Gg2p_Wk7Y-Ic",
  authDomain: "yerinde-com.firebaseapp.com",
  projectId: "yerinde-com",
  storageBucket: "yerinde-com.firebasestorage.app",
  messagingSenderId: "536811642534",
  appId: "1:536811642534:web:b69ed960dc9c4a57675e67",
  measurementId: "G-LMJLYW7MBF"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);