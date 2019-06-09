import { config } from '@/config';
import { http } from '@/http';
import firebase from 'firebase/app';
import 'firebase/messaging';

export async function SetupFcm() {
  try {
    const { data } = await http.get(`${config.api}google_fcm/getMessagingId`);

    if (data) {
      firebase.initializeApp(data);

      const message = firebase.messaging();

      const request = indexedDB.open('firebase_config', 1);

      request.onerror = event => {
        console.error('Error creating database firebase_config indexedDB');
      };

      request.onsuccess = event => {
        const db = event && (event.target as any).result;

        const transaction = db.transaction('configs', 'readwrite');

        transaction.objectStore('configs').clear();

        const configSave = transaction
          .objectStore('configs')
          .add(data.messagingSenderId, 'messagingSenderId');

        configSave.onsuccess = () => {
          navigator.serviceWorker
            .register('./firebase-messaging-sw.js')
            .then(registration => {
              console.info('serviceWorker registration');
              return message.useServiceWorker(registration);
            })
            .then(() => {
              return message.requestPermission();
            })
            .then(() => {
              console.info('Notification permission granted.');
              return message.getToken();
            })
            .then(token => {
              console.info(token);
            })
            .catch(err => {
              console.error('Unable to get permission to notify.', err);
            });
        };
      };

      // On upgrade needed.
      request.onupgradeneeded = event => {
        const db = event && (event.target as any).result;

        if (!db.objectStoreNames.contains('configs')) {
          // Add to indexDB
          db.createObjectStore('configs', { keypath: 'key' });
        }
      };

      // message.onMessage(notification => {
      //   messageStore.commit('setGlobalError', notification);
      // });

      message.onTokenRefresh(() => {
        message
          .getToken()
          .then(refreshedToken => {
            console.info('FCM Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);

            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken as string);
          })
          .catch(err => {
            console.error('Unable to retrieve refreshed token ', err);
          });
      });
    }
  } catch (error) {
    console.error('Google FCM setup error', error);
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('fcmTokenSentToServer') === '1';
}

function setTokenSentToServer(sent: boolean) {
  window.localStorage.setItem('fcmTokenSentToServer', sent ? '1' : '0');
}

async function sendTokenToServer(token: string) {
  if (!isTokenSentToServer()) {
    console.info('Sending token to server...');
    await http.post(`${config.api}google_fcm/registerDeviceToken`, { token });
    setTokenSentToServer(true);
  } else {
    console.info(
      'Token already sent to server so won\'t send it again unless it changes',
    );
  }
}
