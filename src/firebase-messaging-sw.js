importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

console.log("swwwwww");

firebase.initializeApp({
  apiKey: "AIzaSyC9530XhIe2chOiMxDom7eEGpN3B7dTCm4",
  authDomain: "coza-sister-churches.firebaseapp.com",
  projectId: "coza-sister-churches",
  storageBucket: "coza-sister-churches.appspot.com",
  messagingSenderId: "788178658821",
  appId: "1:788178658821:web:d68f2f232a5fda8e6dde6c",
  measurementId: "G-TMFBFBGM1K",
});

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
