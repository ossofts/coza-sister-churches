importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: process.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
});

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message");

  const link = payload.fcmOptions?.link || payload.data?.link;
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/CGLS-76x76.png",
    data: { url: link },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationClick", function (event) {
  event.notification.close();
});
