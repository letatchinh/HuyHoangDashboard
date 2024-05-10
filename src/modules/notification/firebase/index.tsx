import { get } from "lodash";
import { initializeApp } from "firebase/app";
import {
  getToken,
  // getMessaging,
  onMessage,
  isSupported,
  getMessaging,
} from "firebase/messaging";

import { postMessageNewWhBillFirebase } from "./broadCastChanel/firebaseChanel";
import { TYPE_NOTIFICATION } from "../constants";
import apis from "../notification.api";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

let checkSupportFirebaseBrowser = async () => {
  const isSupportedBrowser = await isSupported();
  if (isSupportedBrowser) {
    // if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    requestPermission();
    onMessageListener();
    // }
  } else {
    console.log("Not Supported");
  }
};

checkSupportFirebaseBrowser();

export const getOrRegisterServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
          // {
          //   scope: "/firebase-push-notification-scope",
          // }
        );
      });
  }
  throw new Error("The browser doesn`t support service worker.");
};

export const getFirebaseToken = () => {
  return getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
      serviceWorkerRegistration,
    })
  );
};

export async function getTokenFCM(msg = messaging) {
  // Check support for Firebase
  console.log("Check support for Firebase getTokenFCM");
  if (!msg) {
    console.log("Not Have msg", msg);
    return;
  }
  // Check support for Notification
  if ("Notification" in window && Notification.permission === "denied") {
    console.log("Check Denied Notification GetTokenFCM");
    return;
  }
  console.log("Pass Check Denied GetTokenFCM");
  return getFirebaseToken()
    ?.then((currentToken: any) => {
      console.log("doing in GetToken Firebase");
      if (currentToken) {
        return currentToken;
      } else {
        console.log(
          "Not got token, No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err: any) => {
      console.log(err, "Erro In Get Token Firebase");
    });
}
function requestPermission() {
  if ("Notification" in window) {
    console.log("Have Notification In Window");
    if (Notification.permission === "granted") {
      console.log("Notification permission is granted");
      return getFirebaseToken()
        .then((firebaseToken) => {
          if (firebaseToken) {
            console.log("HAVE TOKEN");
            apis.subscribeToken(firebaseToken);
          }
        })
        .catch((err) =>
          console.error(
            "An error occured while retrieving firebase token. ",
            err
          )
        );
    } else {
      console.log("Notification permission is not granted.");
    }
  } else {
    console.log("Notifications not supported in this browser.");
  }
}
export function onMessageListener() {
  if (!messaging) return;
  onMessage(messaging, (payload: any) => {
    console.log("reiceiver from firebase", payload);
    // CORE
    // Post to Broadcast
    const data = payload?.data;
    switch (payload?.data?.type) {
      case TYPE_NOTIFICATION.ORDER_QUOTATION_CUSTOMER:
        postMessageNewWhBillFirebase({
          ...get(payload, "notification"),
          data: data,
        });
        break;

      case TYPE_NOTIFICATION.ORDER_CONVERT_QUOTATION_CUSTOMER:
        postMessageNewWhBillFirebase({
          ...get(payload, "notification"),
          data: data,
        });
        break;
      case TYPE_NOTIFICATION.ORDER_SUPPLIER:
        postMessageNewWhBillFirebase({
          ...get(payload, "notification"),
          data: data,
        });
        break;
      //   case !!getDataPayload('taskItem'):
      //     postMessageNewWhBillFirebase({...get(payload, 'notification'),data:getDataPayload('taskItem','')})
      //       break;

      default:
        break;
    }
    console.log("Message received. ", payload);
    // ...
  });
}
