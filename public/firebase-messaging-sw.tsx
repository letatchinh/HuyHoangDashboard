
//   console.log("RUNNING IN BACKGROUND");
// // Scripts for firebase and firebase messaging
// // eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyAEF70QNl7uOUOIoVpUipEv9lu9Unsi-3o",
  authDomain: "test-firebase-5ffa7.firebaseapp.com",
  projectId: "test-firebase-5ffa7",
  storageBucket: "test-firebase-5ffa7.appspot.com",
  messagingSenderId: "124266123025",
  appId: "1:124266123025:web:d7f140e583e303f33486b0",
  measurementId: "G-LPS0KQ235L"
};
// // eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// // eslint-disable-next-line no-undef
const messaging = firebase.messaging();
// if (messaging.isSupported()) {
  messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    function getDataPayload(key, defaulted = '') {
      return JSON.parse(payload?.data?.['gcm.notification.' + key] || JSON.stringify(defaulted));
    }
    // Send notification Broadcast
    // Post to Broadcast
    const bc_firebase_chanel = new BroadcastChannel("bc_firebase_chanel");
    switch (true) {
      case !!getDataPayload('billQuotation'):{
        bc_firebase_chanel.postMessage({ ...payload?.notification, data: getDataPayload('billQuotation', '') });
        break;}
        case !!getDataPayload('taskItem'):{
          bc_firebase_chanel.postMessage({ ...payload?.notification, data: getDataPayload('taskItem', '') });
          break;
        }
        default:
          break;
        }
        
        bc_firebase_chanel.close();

    // Send notification Browser
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.data.body,
      data: { url: payload?.data?.click_action }, //the url which we gonna use later
      actions: [{ action: "open_url", title: "Xem ngay" }]
    };

    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(notificationTitle,
      notificationOptions);
    self.addEventListener('notificationclick', function (event) {

      switch (event.action) {
        case 'open_url':
          clients.openWindow(event.notification.data.url); //which we got from above
          break;
        case 'any_other_action':
          clients.openWindow("https://www.example.com");
          break;
      }
    }
      , false);
  });
