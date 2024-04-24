
import { get } from "lodash";

const firebaseJson = '{"REACT_APP_FIREBASE_API_KEY": "AIzaSyBgx_qgU4AL2k3Ar50PX50FnwO693RAnXY", "REACT_APP_FIREBASE_AUTH_DOMAIN": "test-firebase-5ffa7.firebaseapp.com", "REACT_APP_FIREBASE_DATABASE_URL": "https://test-firebase-5ffa7-default-rtdb.firebaseio.com", "REACT_APP_FIREBASE_PROJECT_ID": "test-firebase-5ffa7", "REACT_APP_FIREBASE_STORAGE_BUCKET": "test-firebase-5ffa7.appspot.com", "REACT_APP_FIREBASE_MESSAGING_SENDER_ID": "124266123025", "REACT_APP_FIREBASE_APP_ID": "1:124266123025:web:d7f140e583e303f33486b0","REACT_APP_PUBLIC_VAPID_KEY":"BKfuV2UD9ZleImtPciWyAZTPG_m4BYfxovyFvp0yW9oyL1LMeOtONBWsqeYpT14GyYztP2CKtJ2ROgYT8ageu9M"}';
let config = {};
// cheat the minifier
try {
  config = JSON.parse(firebaseJson);
} catch {}
  const firebaseConfig = {
    apiKey: get(config,'REACT_APP_FIREBASE_API_KEY','config.REACT_APP_FIREBASE_API_KEY') ,
    authDomain: get(config,'REACT_APP_FIREBASE_AUTH_DOMAIN','config.REACT_APP_FIREBASE_AUTH_DOMAIN') ,
    databaseURL:get(config,'REACT_APP_FIREBASE_DATABASE_URL','config.REACT_APP_FIREBASE_DATABASE_URL') ,
    projectId:get(config,'REACT_APP_FIREBASE_PROJECT_ID','config.REACT_APP_FIREBASE_PROJECT_ID'),
    storageBucket:get(config,'REACT_APP_FIREBASE_STORAGE_BUCKET','config.REACT_APP_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId:get(config,'REACT_APP_FIREBASE_MESSAGING_SENDER_ID','config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
    appId:get(config,'REACT_APP_FIREBASE_APP_ID','config.REACT_APP_FIREBASE_APP_ID'),
  };
  export const vapidKeyFirebase = {
    vapidKey : get(config,'REACT_APP_PUBLIC_VAPID_KEY','config.REACT_APP_PUBLIC_VAPID_KEY'),
  }
export default firebaseConfig;

