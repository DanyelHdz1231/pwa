// Manejo de notificaciones push con Firebase Cloud Messaging
import { messaging, getToken, onMessage } from '../config/firebase';

export class FirebasePushManager {
    // Clave VAPID de Firebase (se obtiene de Firebase Console)
    private static vapidKey = 'BLnQRVNHVdE-NzwG_ak9bq9nIZ1qk31g8zn7jzY50VMhT1lrr06gflU3TfbnDzGiXmavHgJBP6AGgCuKF6ZEtKQ'; // Reemplazar con tu clave

    static async checkSupport(): Promise<boolean> {
        // Verificar si estamos en contexto seguro (HTTPS o localhost)
        const isSecureContext = window.isSecureContext;

        if (!isSecureContext) {
            console.warn('⚠️ Las notificaciones push requieren HTTPS o localhost');
            console.warn('⚠️ URL actual:', window.location.href);
            console.warn('⚠️ Para probar desde red local, usa: http://localhost:3000/');
            return false;
        }

        const hasRequirements = (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window &&
            messaging !== null
        );

        if (!hasRequirements) {
            console.error('❌ Requisitos no cumplidos para notificaciones push');
            if (!messaging) {
                console.error('❌ Firebase Messaging no está inicializado (requiere contexto seguro)');
            }
        }

        return hasRequirements;
    }

    static async requestPermission(): Promise<NotificationPermission> {
        if (!await this.checkSupport()) {
            throw new Error('Las notificaciones push no son compatibles');
        }

        return await Notification.requestPermission();
    }

    static async getFirebaseToken(): Promise<string | null> {
        try {
            const permission = await this.requestPermission();

            if (permission !== 'granted') {
                console.log('❌ Permiso de notificación denegado');
                return null;
            }

            if (!messaging) {
                console.error('Firebase Messaging no está disponible');
                return null;
            }

            // Registrar Service Worker de Firebase
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('✅ Service Worker de Firebase registrado');

            // Obtener token de Firebase
            const currentToken = await getToken(messaging, {
                vapidKey: this.vapidKey,
                serviceWorkerRegistration: registration
            });

            if (currentToken) {
                console.log('✅ Token de Firebase obtenido:', currentToken.substring(0, 50) + '...');

                // Guardar token localmente
                localStorage.setItem('fcm_token', currentToken);

                return currentToken;
            } else {
                console.log('❌ No se pudo obtener el token de Firebase');
                return null;
            }
        } catch (error) {
            console.error('❌ Error obteniendo token de Firebase:', error);
            return null;
        }
    }

    static async subscribe(): Promise<string | null> {
        try {
            const token = await this.getFirebaseToken();

            if (!token) {
                return null;
            }

            console.log('📝 Token FCM guardado y listo para recibir notificaciones');

            // Configurar listener para mensajes en primer plano
            this.setupForegroundMessageListener();

            return token;
        } catch (error) {
            console.error('❌ Error en suscripción Firebase:', error);
            return null;
        }
    }

    static setupForegroundMessageListener() {
        if (!messaging) return;

        // Escuchar mensajes cuando la app está en primer plano
        onMessage(messaging, (payload) => {
            console.log('📨 Mensaje recibido en primer plano:', payload);

            const notificationTitle = payload.notification?.title || 'Nueva Notificación';
            const notificationOptions: NotificationOptions = {
                body: payload.notification?.body || 'Tienes un nuevo mensaje',
                icon: payload.notification?.icon || '/icons/icon-192x192.svg',
                badge: '/icons/icon-72x72.svg',
                tag: 'firebase-foreground',
                requireInteraction: false,
            };

            // Mostrar notificación
            if (Notification.permission === 'granted') {
                new Notification(notificationTitle, notificationOptions);
            }
        });
    }

    static async sendTestNotification(): Promise<boolean> {
        try {
            const token = localStorage.getItem('fcm_token');

            if (!token) {
                console.error('❌ No hay token FCM. Primero suscríbete a notificaciones.');
                return false;
            }

            console.log('📤 Enviando notificación de prueba usando token:', token.substring(0, 50) + '...');

            // Crear la notificación de prueba localmente
            // En producción, esto se haría desde el backend usando el Admin SDK de Firebase
            const notificationTitle = '🎉 ¡Notificación de Prueba!';
            const notificationOptions: NotificationOptions = {
                body: 'Esta es una notificación de prueba enviada desde el frontend.',
                icon: '/icons/icon-192x192.svg',
                badge: '/icons/icon-72x72.svg',
                tag: 'test-notification',
                requireInteraction: false,
                data: {
                    url: '/',
                    timestamp: Date.now()
                }
            };

            if (Notification.permission === 'granted') {
                new Notification(notificationTitle, notificationOptions);
                console.log('✅ Notificación de prueba mostrada correctamente');
                return true;
            } else {
                console.error('❌ No hay permisos para mostrar notificaciones');
                return false;
            }
        } catch (error) {
            console.error('❌ Error enviando notificación de prueba:', error);
            return false;
        }
    }

    static async unsubscribe(): Promise<boolean> {
        try {
            // Eliminar token local
            localStorage.removeItem('fcm_token');
            console.log('✅ Token de Firebase eliminado');

            return true;
        } catch (error) {
            console.error('❌ Error al desuscribirse:', error);
            return false;
        }
    }

    static getToken(): string | null {
        return localStorage.getItem('fcm_token');
    }
}

// Mantener compatibilidad con el código existente
export class PushNotificationManager extends FirebasePushManager {
    // Alias para mantener compatibilidad
}