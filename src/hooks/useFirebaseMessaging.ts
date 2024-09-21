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
  apiKey: "AIzaSyDAYhQ7mCYqLvdvn1JQE0y-q7s6S6JHuTs",
  authDomain: "cozaworkforceapp.firebaseapp.com",
  projectId: "cozaworkforceapp",
  storageBucket: "cozaworkforceapp.appspot.com",
  messagingSenderId: "378695098622",
  appId: "1:378695098622:web:1231f01bb09f028d1605af",
  measurementId: "G-42VJ28YWBF",
};
// const firebaseConfig = {
//   // Your Firebase configuration object
//   apiKey: "AIzaSyC9530XhIe2chOiMxDom7eEGpN3B7dTCm4",
//   authDomain: "coza-sister-churches.firebaseapp.com",
//   projectId: "coza-sister-churches",
//   storageBucket: "coza-sister-churches.appspot.com",
//   messagingSenderId: "788178658821",
//   appId: "1:788178658821:web:d68f2f232a5fda8e6dde6c",
//   measurementId: "G-TMFBFBGM1K",
// };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// const browser = Bowser.parse(window.navigator.userAgent);

var navigator_info = window.navigator;
var screen_info = window.screen;
var uid = navigator_info.userAgent.replace(/\D+/g, "");
uid += screen_info.height || "";
uid += screen_info.width || "";
uid += screen_info.pixelDepth || "";

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<MessagePayload | null>(null);
  const user = useUserStore((state) => state.user);

  const mutation = usePostFcmToken();

  const getFCMToken = async () => {
    console.log("getFCMToken");
    try {
      // Wait for service worker installation to be ready
      //   const serviceWorkerRegistration = await navigator.serviceWorker.ready;
      //   console.log({ serviceWorkerRegistration });
      //   console.log("Service Worker is ready");

      // const currentToken = await getToken(messaging, {
      //   vapidKey:
      //     "BHygvO8rNr-PM0kvCgwFw3XBwQ2b4RYLrGiLiAprT7r9G2I4yWuDzRK4iTI7qv55lTAX12Ew7MnotmVv0qsVa3A",
      //   // serviceWorkerRegistration,
      // });
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BA6cxKIbOYaybCO0byso81Ahq66nuyTx6uzHF3CU7kZ7IlHjdopdMm52KAQ0kkgHH3um1ryJ-5_56uMq22B-3H4",
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

    // fetch(`${import.meta.env.VITE_BASE_URL}/account/addDeviceToken`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: email,
    //     deviceId: deviceId,
    //     fcmToken: token,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((_data) => console.log("Token sent to backend"))
    //   .catch((error) =>
    //     console.error("Error sending token to backend:", error)
    //   );
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDAYhQ7mCYqLvdvn1JQE0y-q7s6S6JHuTs",
//   authDomain: "cozaworkforceapp.firebaseapp.com",
//   projectId: "cozaworkforceapp",
//   storageBucket: "cozaworkforceapp.appspot.com",
//   messagingSenderId: "378695098622",
//   appId: "1:378695098622:web:1231f01bb09f028d1605af",
//   measurementId: "G-42VJ28YWBF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
