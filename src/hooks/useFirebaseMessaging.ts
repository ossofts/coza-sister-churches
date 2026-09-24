import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
  isSupported,
  Messaging,
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

let messagingInstance: Messaging | null = null;

export async function getMessagingSafe(): Promise<Messaging | null> {
  try {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !navigator.serviceWorker
    ) {
      return null;
    }
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return null;
    }
    messagingInstance ??= getMessaging(app);
    return messagingInstance;
  } catch (err) {
    console.warn("Firebase Messaging unavailable:", err);
    return null;
  }
}

const navigator_info = typeof window !== "undefined" ? window.navigator : null;
const screen_info = typeof window !== "undefined" ? window.screen : null;
let uid = navigator_info?.userAgent?.replace(/\D+/g, "") || "";
uid += screen_info?.height || "";
uid += screen_info?.width || "";
uid += screen_info?.pixelDepth || "";

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<MessagePayload | null>(null);
  const user = useUserStore((state) => state.user);

  const mutation = usePostFcmToken();

  const getFCMToken = async (messaging: Messaging) => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
      });

      if (currentToken) {
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
    const email = user?.email;
    const deviceId = md5(uid);

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

  useEffect(() => {
    let active = true;
    let unsubscribeFn: (() => void) | null = null;

    const initMessaging = async () => {
      const messaging = await getMessagingSafe();
      if (!messaging || !active) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted" && active) {
          console.log("Notification permission granted.");
          await getFCMToken(messaging);
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }

      if (!active) return;

      try {
        unsubscribeFn = onMessage(messaging, (payload) => {
          if (!active) return;
          setNotification(payload);
          toast(payload.notification?.title, {
            description: payload.notification?.body as string,
            action: {
              label: "Ok",
              onClick: () => console.log("Ok"),
            },
          });
        });
      } catch (err) {
        console.warn("Failed to subscribe to foreground messages:", err);
      }
    };

    initMessaging();

    return () => {
      active = false;
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  return { fcmToken, notification };
}

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
