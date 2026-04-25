importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBEW58FfVbVNXQJ6MtTc63Gg2p_Wk7Y-Ic",
  authDomain: "yerinde-com.firebaseapp.com",
  projectId: "yerinde-com",
  storageBucket: "yerinde-com.firebasestorage.app",
  messagingSenderId: "536811642534",
  appId: "1:536811642534:web:b69ed960dc9c4a57675e67",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo_light.png",
  });
});