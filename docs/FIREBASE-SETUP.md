# 🔥 Configuración de Firebase Cloud Messaging

Esta guía te ayudará a configurar Firebase Cloud Messaging (FCM) para enviar notificaciones push desde el frontend sin necesidad de un servidor backend personalizado.

## 📋 Prerrequisitos

- Cuenta de Google
- Proyecto en [Firebase Console](https://console.firebase.google.com/)

## 🚀 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Ingresa un nombre para tu proyecto (ej: "mi-pwa-notificaciones")
4. Sigue los pasos del asistente:
   - Puedes deshabilitar Google Analytics si no lo necesitas
5. Haz clic en **"Crear proyecto"**

## ⚙️ Paso 2: Configurar la Aplicación Web

1. En la página principal de tu proyecto, haz clic en el ícono **Web** (`</>`)
2. Registra tu app con un nombre (ej: "Mi PWA")
3. **Importante:** Marca la casilla **"También configurar Firebase Hosting"** si deseas hosting gratuito
4. Haz clic en **"Registrar app"**

## 🔑 Paso 3: Obtener las Credenciales

### A. Credenciales de Configuración

Después de registrar tu app, verás un código de configuración como este:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
};
```

### B. VAPID Key (Clave del Servidor Web Push)

1. Ve a **⚙️ Configuración del proyecto** (ícono de engranaje arriba a la izquierda)
2. Selecciona la pestaña **"Cloud Messaging"**
3. En la sección **"Configuración web"**, busca **"Certificados de clave push web"**
4. Haz clic en **"Generar par de claves"**
5. Copia la **Clave pública** (VAPID key)

## 📝 Paso 4: Actualizar el Código

### Archivo: `src/config/firebase.ts`

Reemplaza las credenciales de ejemplo con las tuyas:

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'TU_AUTH_DOMAIN_AQUI',
  projectId: 'TU_PROJECT_ID_AQUI',
  storageBucket: 'TU_STORAGE_BUCKET_AQUI',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID_AQUI',
  appId: 'TU_APP_ID_AQUI',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = getMessaging(app);

export { app, messaging };
```

### Archivo: `src/utils/firebasePushNotifications.ts`

Actualiza la VAPID key en la línea correspondiente:

```typescript
const currentToken = await getToken(messaging, {
  vapidKey: 'TU_VAPID_KEY_PUBLICA_AQUI',
});
```

### Archivo: `public/firebase-messaging-sw.js`

Actualiza las credenciales de Firebase:

```javascript
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'TU_AUTH_DOMAIN_AQUI',
  projectId: 'TU_PROJECT_ID_AQUI',
  storageBucket: 'TU_STORAGE_BUCKET_AQUI',
  messagingSenderId: 'TU_MESSAGING_SENDER_ID_AQUI',
  appId: 'TU_APP_ID_AQUI',
});
```

## 🧪 Paso 5: Probar las Notificaciones

### Desde la Aplicación

1. Inicia tu aplicación: `npm run dev`
2. Abre la aplicación en el navegador
3. Haz clic en **"Activar Notificaciones"**
4. Acepta el permiso de notificaciones del navegador
5. Una vez suscrito, haz clic en **"🧪 Enviar Notificación de Prueba"**
6. Deberías ver una notificación en tu navegador

### Desde Firebase Console

También puedes enviar notificaciones desde la consola de Firebase:

1. Ve a **Firebase Console** → Tu proyecto
2. En el menú lateral, selecciona **"Messaging"** o **"Cloud Messaging"**
3. Haz clic en **"Enviar tu primer mensaje"** o **"New campaign"**
4. Completa los campos:
   - **Título de la notificación**: "Prueba desde Firebase"
   - **Texto de la notificación**: "Esta es una notificación de prueba"
5. Haz clic en **"Siguiente"**
6. En **"Target"**, selecciona tu aplicación web
7. Haz clic en **"Revisar"** y luego **"Publicar"**

## 🔍 Verificar el Token FCM

El token FCM se guarda automáticamente en `localStorage` con la clave `fcm-token`. Para verlo:

1. Abre las **DevTools** del navegador (F12)
2. Ve a la pestaña **"Application"** o **"Aplicación"**
3. En el menú lateral, selecciona **"Local Storage"** → tu dominio
4. Busca la clave `fcm-token`
5. Copia el valor del token

Este token es único por navegador/dispositivo y se usa para enviar notificaciones específicas.

## 📱 Enviar Notificaciones Programáticamente

Si deseas enviar notificaciones desde un backend personalizado, usa la Firebase Admin SDK:

### Opción 1: REST API de Firebase

```bash
POST https://fcm.googleapis.com/v1/projects/TU_PROJECT_ID/messages:send
Content-Type: application/json
Authorization: Bearer TU_ACCESS_TOKEN

{
  "message": {
    "token": "TOKEN_FCM_DEL_USUARIO",
    "notification": {
      "title": "Título de la notificación",
      "body": "Cuerpo del mensaje"
    },
    "webpush": {
      "fcm_options": {
        "link": "https://tu-app.com"
      }
    }
  }
}
```

### Opción 2: Node.js con Firebase Admin SDK

```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  notification: {
    title: 'Título',
    body: 'Mensaje',
  },
  token: 'TOKEN_FCM_DEL_USUARIO',
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('Notificación enviada:', response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

## 🛠️ Solución de Problemas

### Error: "Firebase config is not defined"

- Verifica que hayas copiado correctamente todas las credenciales
- Asegúrate de que no haya espacios ni comillas adicionales

### Error: "Messaging: A problem occurred while subscribing"

- Verifica que la VAPID key sea correcta
- Asegúrate de que la VAPID key corresponda al proyecto correcto

### No aparece el permiso de notificaciones

- Verifica que estés usando HTTPS o localhost
- Revisa que el navegador soporte notificaciones
- Limpia el caché y recarga la página

### La notificación no llega

- Verifica que el token FCM esté guardado correctamente
- Revisa la consola del navegador por errores
- Asegúrate de que el service worker esté registrado correctamente

### El service worker no se registra

- Verifica que el archivo `firebase-messaging-sw.js` esté en la carpeta `public/`
- Asegúrate de que el archivo tenga las credenciales correctas
- Comprueba que no haya errores de sintaxis en el archivo

## 📚 Recursos Adicionales

- [Documentación oficial de FCM](https://firebase.google.com/docs/cloud-messaging)
- [Guía de FCM para Web](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Referencia de la API de Messaging](https://firebase.google.com/docs/reference/js/messaging_)
- [Ejemplos de Firebase](https://github.com/firebase/quickstart-js/tree/master/messaging)

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Firebase Console
- [ ] Aplicación web registrada en el proyecto
- [ ] VAPID key generada
- [ ] Credenciales copiadas en `src/config/firebase.ts`
- [ ] VAPID key actualizada en `src/utils/firebasePushNotifications.ts`
- [ ] Credenciales actualizadas en `public/firebase-messaging-sw.js`
- [ ] Aplicación probada con `npm run dev`
- [ ] Notificaciones activadas en el navegador
- [ ] Notificación de prueba recibida correctamente

---

**¡Listo!** Ahora tu PWA puede enviar y recibir notificaciones push usando Firebase Cloud Messaging sin necesidad de un servidor backend personalizado. 🎉
