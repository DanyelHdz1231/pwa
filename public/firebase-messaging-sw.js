// firebase-messaging-sw.js
// Service Worker para Firebase Cloud Messaging

// Importar Firebase Scripts para Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuración de Firebase (debe coincidir con la del cliente)
// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCbXd9Et2-ooUNU3WCDTVdBt-Ed32ypytE",
    authDomain: "pwa-app-e57a2.firebaseapp.com",
    projectId: "pwa-app-e57a2",
    storageBucket: "pwa-app-e57a2.firebasestorage.app",
    messagingSenderId: "906595131319",
    appId: "1:906595131319:web:6b74011fec29c327ec5232"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

    const notificationTitle = payload.notification?.title || 'Nueva Notificación';
    const notificationOptions = {
        body: payload.notification?.body || 'Tienes un nuevo mensaje',
        icon: payload.notification?.icon || '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        data: payload.data,
        tag: payload.data?.tag || 'firebase-notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Abrir',
                icon: '/icons/icon-72x72.svg'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/icons/icon-72x72.svg'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Clic en notificación:', event);

    event.notification.close();

    if (event.action === 'open' || !event.action) {
        // Abrir la aplicación
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('[firebase-messaging-sw.js] Service Worker de Firebase cargado');