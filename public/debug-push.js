// Script de ayuda para pruebas de notificaciones push
// Pega esto en la consola del navegador para facilitar las pruebas

console.log('🔧 Herramientas de Push Notifications cargadas');

// 1. Verificar estado de notificaciones
window.checkPushStatus = async function () {
    console.log('\n📊 Estado de Notificaciones Push:\n');

    // Permisos
    console.log('Permiso:', Notification.permission);

    // Service Worker
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        console.log('Service Worker:', registration.active ? '✅ Activo' : '❌ Inactivo');

        // Suscripción
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            console.log('Suscripción:', '✅ Activa');
            console.log('Endpoint:', subscription.endpoint.substring(0, 50) + '...');

            const p256dh = subscription.getKey('p256dh');
            const auth = subscription.getKey('auth');
            console.log('Claves p256dh:', p256dh ? '✅ Presente' : '❌ Ausente');
            console.log('Claves auth:', auth ? '✅ Presente' : '❌ Ausente');
        } else {
            console.log('Suscripción:', '❌ No activa');
        }
    }

    console.log('\n');
};

// 2. Limpiar suscripciones antiguas
window.clearPushSubscription = async function () {
    console.log('🗑️  Limpiando suscripciones antiguas...');

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            console.log('✅ Suscripción eliminada correctamente');
        } else {
            console.log('ℹ️  No hay suscripción activa para eliminar');
        }
    } catch (error) {
        console.error('❌ Error eliminando suscripción:', error);
    }
};

// 3. Suscribirse a notificaciones
window.subscribePush = async function () {
    console.log('📝 Suscribiendo a notificaciones...');

    try {
        if (Notification.permission !== 'granted') {
            console.log('Solicitando permisos...');
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('❌ Permiso denegado');
                return;
            }
        }

        const registration = await navigator.serviceWorker.ready;

        // Clave VAPID (actualiza esto si cambió en el servidor)
        const vapidPublicKey = 'BAV7IGhd1Rg-D8GcuzAq_lHspniD424YHOy61qnQQqiUmgrXD-_gj0hehlzFknNHCKmh20b506dhSos2alx4TRM';

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });

        console.log('✅ Suscripción creada');

        // Enviar al servidor
        const key = subscription.getKey('p256dh');
        const auth = subscription.getKey('auth');

        const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: key ? arrayBufferToBase64(key) : null,
                auth: auth ? arrayBufferToBase64(auth) : null
            }
        };

        const response = await fetch('http://localhost:3002/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscriptionData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Suscripción enviada al servidor:', data);
        } else {
            console.log('❌ Error enviando al servidor:', response.status);
        }

    } catch (error) {
        console.error('❌ Error en suscripción:', error);
    }
};

// 4. Enviar notificación de prueba
window.sendTestNotification = async function () {
    console.log('📤 Enviando notificación de prueba...');

    try {
        const response = await fetch('http://localhost:3002/api/push/send-test', {
            method: 'POST'
        });

        const data = await response.json();
        console.log(data.success ? '✅' : '❌', data.message);
    } catch (error) {
        console.error('❌ Error enviando notificación:', error);
    }
};

// Funciones auxiliares
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Mostrar ayuda
console.log(`
🛠️  Comandos Disponibles:

1. checkPushStatus()          - Verificar estado de notificaciones
2. clearPushSubscription()    - Limpiar suscripciones antiguas
3. subscribePush()            - Suscribirse a notificaciones
4. sendTestNotification()     - Enviar notificación de prueba

📖 Ejemplo de uso:
   > checkPushStatus()         // Ver estado actual
   > clearPushSubscription()   // Limpiar suscripción antigua
   > subscribePush()           // Nueva suscripción
   > sendTestNotification()    // Probar notificación

`);

// Auto-verificar estado al cargar
checkPushStatus();