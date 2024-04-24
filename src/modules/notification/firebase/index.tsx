import { initializeApp} from "firebase/app";
import { getMessaging, getToken, onMessage,isSupported } from 'firebase/messaging';
import { get } from "lodash";
import { postMessageNewWhBillFirebase } from "./broadCastChanel/firebaseChanel";
import firebaseConfig, { vapidKeyFirebase } from "./config";
import apis from "../notification.api";


let messaging: any;
let checkSupportFirebaseBrowser = async () => {
    const isSupportedBrowser = await isSupported();
    console.log("Checking... support firebase");
    if(isSupportedBrowser){
        console.log("Supported");
        // if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
          const app = initializeApp(firebaseConfig);
          messaging = getMessaging(app);
          requestPermission();
          onMessageListener();
        // }
    }else{
        console.log("Not Supported");
    }

}
checkSupportFirebaseBrowser();
export async function getTokenFCM (msg=messaging) {
    // Check support for Firebase
    console.log('Check support for Firebase getTokenFCM');
    if(!msg) {
        console.log('Not Have msg',msg);
        return
    }
    // Check support for Notification
    if ("Notification" in window && Notification.permission === 'denied') {
        console.log("Check Denied Notification GetTokenFCM");
        return
    } 
    console.log("Pass Check Denied GetTokenFCM");
    // console.log(vapidKeyFirebase.vapidKey,'vapidKeyFirebase.vapidKey');
    return  getToken(msg, { vapidKey: vapidKeyFirebase.vapidKey }).then((currentToken: any) => {
        console.log("doing in GetToken Firebase");
          if (currentToken) {
            console.log("got token");
              return currentToken;
          } else {
            console.log("Not got token");
              console.log('No registration token available. Request permission to generate one.');
          }
      }).catch((err: any) => {
        console.log(err,'Erro In Get Token Firebase');
      })
  };

function requestPermission() {
    if ("Notification" in window) {
        console.log("Have Notification In Window");
        if (Notification.permission === 'granted') {
            console.log("'Notification permission is granted");
            return getTokenFCM().then((currentToken: any) => {
                if (currentToken) {
                    console.log("HAVE TOKEN");
                    apis.subscribeToken(currentToken);
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err: any) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        } else {
            console.log('Notification permission is not granted.');
        }
    } else {
        console.log('Notifications not supported in this browser.');
    }
}
function onMessageListener () {
    if(!messaging) return 
    onMessage(messaging, (payload: any) => {
        console.log('reiceiver from firebase');
      // CORE
      const getDataPayload = (key: any,defaulted='') =>  JSON.parse(get(payload,[`data.gcm.notification.${key}`],JSON.stringify(defaulted)));
      // Post to Broadcast
      switch (true) {
          case !!getDataPayload('billQuotation'):
            postMessageNewWhBillFirebase({...get(payload, 'notification'),data:getDataPayload('billQuotation','')})
              break;
      
          case !!getDataPayload('productDelivery'):
            postMessageNewWhBillFirebase({...get(payload, 'notification'),data:getDataPayload('productDelivery','')})
              break;
          case !!getDataPayload('taskItem'):
            postMessageNewWhBillFirebase({...get(payload, 'notification'),data:getDataPayload('taskItem','')})
              break;
      
          default:
              break;
      }
      console.log('Message received. ', payload);
      // ...
  });
  };


  



