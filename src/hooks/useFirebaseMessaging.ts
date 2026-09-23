import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import md5 from "blueimp-md5";
// import Bowser from "bowser";
import useUserStore from "@/store/userStore";
import { toast } from "sonner";
import { usePostFcmToken } from "@/services/notification";

const firebaseConfig = {
  // Your Firebase configuration object
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// const browser = Bowser.parse(window.navigator.userAgent);

const navigator_info = window.navigator;
const screen_info = window.screen;
let uid = navigator_info.userAgent.replace(/\D+/g, "");
uid += screen_info.height || "";
uid += screen_info.width || "";
uid += screen_info.pixelDepth || "";

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<MessagePayload | null>(null);
  const user = useUserStore((state) => state.user);

  const mutation = usePostFcmToken();

  const getFCMToken = async () => {
    // console.log("getFCMToken");
    try {
      // Wait for service worker installation to be ready
      //   const serviceWorkerRegistration = await navigator.serviceWorker.ready;
      //   console.log({ serviceWorkerRegistration });
      //   console.log("Service Worker is ready");

      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
      });

      if (currentToken) {
        // console.log("FCM token:", currentToken);
        setFcmToken(currentToken);
        await sendTokenToBackend(currentToken);
      } else {
        console.log("No registration token available.");
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  };

  const sendTokenToBackend = async (token: string) => {
    const email = user?.email; // Get this from your app's state or user input
    const deviceId = md5(uid); // Generate or retrieve a unique device ID

    try {
      const data = await mutation.mutateAsync({
        email: String(email),
        deviceId: deviceId,
        fcmToken: token,
      });

      if (data) {
        console.log("Token sent to backend");
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        // console.log({ payload });
        resolve(payload);
      });
    });
  };

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          await getFCMToken();
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };

    requestPermission();

    // const unsubscribe = onMessage(messaging, (payload) => {
    //   console.log("Message received. ", payload);
    //   setNotification(payload);
    // });

    const unsubscribe = onMessageListener().then((payload) => {
      // console.log("Message received. ", payload);
      setNotification(payload as MessagePayload);
      // console.log({
      //   "notification-title": (payload as MessagePayload).notification?.title,
      //   "notification-body": (payload as MessagePayload).notification
      //     ?.body as string,
      // });

      toast((payload as MessagePayload).notification?.title, {
        description: (payload as MessagePayload).notification?.body as string,
        action: {
          label: "Ok",
          onClick: () => console.log("Ok"),
        },
      });

      // showAlert(
      //   "info",
      //   (payload as MessagePayload).notification?.body as string,
      //   {
      //     seconds: null,
      //     title: (payload as MessagePayload).notification?.title,
      //   }
      // );
    });

    return () => {
      unsubscribe.catch((err) => console.log("unsubscribe failed", err));
    };
  }, []);

  return { fcmToken, notification };
}

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
