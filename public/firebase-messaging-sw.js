console.log("RUNNING IN BACKGROUND");
// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef

importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: 'config.REACT_APP_FIREBASE_API_KEY' ?? process.env.REACT_APP_FIREBASE_API_KEY ,
  authDomain: 'config.REACT_APP_FIREBASE_AUTH_DOMAIN' ?? process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ,
  projectId: 'config.REACT_APP_FIREBASE_PROJECT_ID' ?? process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: 'config.REACT_APP_FIREBASE_STORAGE_BUCKET' ?? process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: 'config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID' ?? process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ,
  appId: 'config.REACT_APP_FIREBASE_APP_ID' ?? process.env.REACT_APP_FIREBASE_APP_ID ,
  measurementId: 'config.REACT_APP_FIREBASE_MEASUREMENT_ID' ?? process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ,
};
const TYPE_NOTIFICATION  = {
  ORDER_CONVERT_QUOTATION_CUSTOMER: "ORDER_CONVERT_QUOTATION_CUSTOMER",
  ORDER_QUOTATION_CUSTOMER: "ORDER_QUOTATION_CUSTOMER",
  ORDER_SUPPLIER: "ORDER_SUPPLIER",
};
// // eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
// if (messaging.isSupported()) {
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const data = payload.data;
  // function getDataPayload(key, defaulted = "") {
  //   return JSON.parse(
  //     payload?.data?.["gcm.notification." + key] || JSON.stringify(defaulted)
  //   );
  // }
  // Send notification Broadcast
  // Post to Broadcast
  const bc_firebase_chanel = new BroadcastChannel("bc_firebase_chanel");
  switch (data?.type) {
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
    //   case !!getDataPayload('taskItem'):
    //     postMessageNewWhBillFirebase({...get(payload, 'notification'),data:getDataPayload('taskItem','')})
    //       break;

    default:
      break;
  }

  bc_firebase_chanel.close();

  // Send notification Browser
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.data.body,
    data: { url: payload?.data?.click_action }, //the url which we gonna use later
    actions: [{ action: "open_url", title: "Xem ngay" }],
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener(
    "notificationclick",
    function (event) {
      switch (event.action) {
        case "open_url":
          clients.openWindow(event.notification.data.url); //which we got from above
          break;
        case "any_other_action":
          clients.openWindow("https://www.example.com");
          break;
      }
    },
    false
  );
});
