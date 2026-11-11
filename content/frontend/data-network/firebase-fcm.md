---
id: firebase-fcm
name: Firebase Cloud Messaging
kind: service
status: work
tags: [push-notifications, firebase, messaging, pwa, cloud]
what: "Cross-platform messaging solution from Google for sending push notifications and data messages reliably to web and mobile clients."
why: "Delivers real-time notifications to users even when browser tabs are closed, handling background delivery through web push standards."
problem: "Direct WebSocket connections require persistent active tabs and drain battery, failing completely when users close the web browser."
relations:
  - { to: browser-apis, label: "uses notification and push api of" }
  - { to: javascript, label: "client sdk implemented in" }
  - { to: api-error-layer, label: "registers device token through" }
links:
  - { title: "Firebase Cloud Messaging Documentation", url: https://firebase.google.com/docs/cloud-messaging }
alsoIn: []
source: work
---

## Example
```ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "app.firebaseapp.com",
  projectId: "app-prod",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestPushPermission(vapidKey: string): Promise<string | null> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission was denied");
    return null;
  }

  const token = await getToken(messaging, { vapidKey });
  return token;
}

export function subscribeToForegroundPush(onReceived: (payload: MessagePayload) => void): () => void {
  return onMessage(messaging, (payload) => {
    onReceived(payload);
  });
}
```

## Key points
- **Foreground vs background dispatch**: `onMessage()` triggers when the app tab is active, whereas background messages require `firebase-messaging-sw.js` running inside a Service Worker.
- **VAPID key authorization**: Web push requires generating a voluntary application server identity (VAPID) key pair to authenticate your app server with browser push services.
- **Token lifecycle management**: FCM device tokens can expire or rotate; apps must persist and refresh token registrations with the backend to ensure reliable message delivery.
