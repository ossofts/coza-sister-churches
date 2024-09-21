/// <reference lib="webworker" />

import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
  // Your Firebase configuration object
  // apiKey, authDomain, projectId, etc.
  apiKey: "AIzaSyC9530XhIe2chOiMxDom7eEGpN3B7dTCm4",
  authDomain: "coza-sister-churches.firebaseapp.com",
  projectId: "coza-sister-churches",
  storageBucket: "coza-sister-churches.appspot.com",
  messagingSenderId: "788178658821",
  appId: "1:788178658821:web:d68f2f232a5fda8e6dde6c",
  measurementId: "G-TMFBFBGM1K",
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

export {};
