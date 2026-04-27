import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

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

export const messaging = (async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
    return null;
  } catch (err) {
    console.error("Firebase Messaging not supported", err);
    return null;
  }
})();