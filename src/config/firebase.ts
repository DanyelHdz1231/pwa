// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCbXd9Et2-ooUNU3WCDTVdBt-Ed32ypytE",
    authDomain: "pwa-app-e57a2.firebaseapp.com",
    projectId: "pwa-app-e57a2",
    storageBucket: "pwa-app-e57a2.appspot.com",
    messagingSenderId: "906595131319",
    appId: "1:906595131319:web:6b74011fec29c327ec5232"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de Messaging
let messaging: any = null;

try {
    messaging = getMessaging(app);
} catch (error) {
    console.log('Firebase Messaging no está disponible:', error);
}

export { app, messaging, getToken, onMessage };