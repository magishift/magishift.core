importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js');

var request = indexedDB.open('firebase_config', 1);

request.onerror = function(event) {
  console.log('[onerror]', request.error);
};

request.onsuccess = function(event) {
  var db = event.target.result; // === request.result

  const transaction = db.transaction('configs', 'readwrite');

  const storeGet = transaction.objectStore('configs').get('messagingSenderId');

  storeGet.onsuccess = function(event) {
    // Initialize the Firebase app in the service worker by passing in the
    // messagingSenderId.
    firebase.initializeApp({ messagingSenderId: storeGet.result });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
      const notificationTitle = payload.title;
      const notificationOptions = {
        body: payload.body,
        icon: './favicon.ico',
      };

      return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      );
    });
  };
};
