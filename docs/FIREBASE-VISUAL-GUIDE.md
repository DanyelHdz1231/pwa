# 🎯 Guía Visual: Firebase Console

Esta guía visual te ayudará a navegar por Firebase Console para obtener las credenciales necesarias.

## 📌 Paso 1: Crear Proyecto

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Agregar proyecto"** o **"Add project"**

```
┌─────────────────────────────────────────┐
│  Firebase Console                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  + Agregar proyecto               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Tus proyectos:                        │
│  (ninguno)                             │
│                                         │
└─────────────────────────────────────────┘
```

3. Ingresa el nombre del proyecto:

```
┌─────────────────────────────────────────┐
│  Crear un proyecto                      │
├─────────────────────────────────────────┤
│                                         │
│  Paso 1 de 3                           │
│                                         │
│  Nombre del proyecto:                  │
│  ┌───────────────────────────────────┐ │
│  │ mi-pwa-notificaciones             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ ] Habilitar Google Analytics       │
│      (opcional)                        │
│                                         │
│              [Cancelar] [Continuar]    │
└─────────────────────────────────────────┘
```

## 📌 Paso 2: Registrar App Web

Una vez creado el proyecto:

```
┌─────────────────────────────────────────┐
│  🏠 mi-pwa-notificaciones               │
├─────────────────────────────────────────┤
│                                         │
│  Agrega una app para comenzar          │
│                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐       │
│  │ 🍎 │  │ 🤖 │  │</> │  │Unity│      │
│  │iOS │  │Andr│  │Web │  │    │       │
│  └────┘  └────┘  └────┘  └────┘       │
│                    ↑                    │
│              HAZ CLIC AQUÍ              │
│                                         │
└─────────────────────────────────────────┘
```

1. Haz clic en el ícono **Web** (`</>`)
2. Completa el formulario:

```
┌─────────────────────────────────────────┐
│  Agrega Firebase a tu app web           │
├─────────────────────────────────────────┤
│                                         │
│  Alias de la app web:                  │
│  ┌───────────────────────────────────┐ │
│  │ Mi PWA                            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [✓] También configurar Firebase       │
│      Hosting para esta app             │
│                                         │
│              [Cancelar] [Registrar app]│
└─────────────────────────────────────────┘
```

## 📌 Paso 3: Copiar Configuración

Después de registrar, verás el código de configuración:

```javascript
// SDK de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB1234567890abcdefghijklmnop',
  authDomain: 'mi-pwa-notificaciones.firebaseapp.com',
  projectId: 'mi-pwa-notificaciones',
  storageBucket: 'mi-pwa-notificaciones.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
};
```

**🎯 COPIA ESTO** y pégalo en `src/config/firebase.ts`

## 📌 Paso 4: Obtener VAPID Key

1. Haz clic en el **ícono de engranaje ⚙️** (arriba a la izquierda)
2. Selecciona **"Configuración del proyecto"**

```
┌─────────────────────────────────────────┐
│  ⚙️ Configuración del proyecto          │
├─────────────────────────────────────────┤
│                                         │
│  General  Cloud Messaging  Integraciones│
│  ───────                                │
│                                         │
│  HAZ CLIC AQUÍ ↑                       │
│                                         │
└─────────────────────────────────────────┘
```

3. Ve a la pestaña **"Cloud Messaging"**
4. Busca **"Configuración web"** o **"Web configuration"**

```
┌─────────────────────────────────────────┐
│  Cloud Messaging                        │
├─────────────────────────────────────────┤
│                                         │
│  Configuración web                     │
│                                         │
│  Certificados de clave push web        │
│  (Web Push certificates)               │
│                                         │
│  Clave pública (VAPID):                │
│  ┌───────────────────────────────────┐ │
│  │ BPq... (no generada)              │ │
│  └───────────────────────────────────┘ │
│                                         │
│       [Generar par de claves]          │
│            ↑                            │
│      HAZ CLIC AQUÍ                     │
│                                         │
└─────────────────────────────────────────┘
```

5. Haz clic en **"Generar par de claves"**
6. Copia la clave pública:

```
┌─────────────────────────────────────────┐
│  Certificados de clave push web        │
├─────────────────────────────────────────┤
│                                         │
│  Clave pública (VAPID):                │
│  ┌───────────────────────────────────┐ │
│  │ BPqRw...xyz123                    │ │
│  │              [📋 Copiar]           │ │
│  └───────────────────────────────────┘ │
│        ↑                                │
│   COPIA ESTO                           │
│                                         │
└─────────────────────────────────────────┘
```

**🎯 COPIA ESTO** y pégalo en:

- `src/utils/firebasePushNotifications.ts` (línea con `vapidKey`)
- `public/firebase-messaging-sw.js` (NO es necesario aquí)

## 📌 Dónde Pegar las Credenciales

### Archivo 1: `src/config/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  // 👇 PEGA AQUÍ todo el objeto firebaseConfig
  apiKey: 'AIzaSy...',
  authDomain: 'mi-pwa-notificaciones.firebaseapp.com',
  projectId: 'mi-pwa-notificaciones',
  storageBucket: 'mi-pwa-notificaciones.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
  // 👆 FIN
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };
```

### Archivo 2: `src/utils/firebasePushNotifications.ts`

```typescript
static async subscribe(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BPqRw...xyz123'  // 👈 PEGA AQUÍ la VAPID key
      });

      if (currentToken) {
        console.log('Token FCM obtenido:', currentToken);
        localStorage.setItem('fcm-token', currentToken);
        return currentToken;
      }
    }
    return null;
  } catch (error) {
    console.error('Error al suscribirse:', error);
    throw error;
  }
}
```

### Archivo 3: `public/firebase-messaging-sw.js`

```javascript
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
);

firebase.initializeApp({
  // 👇 PEGA AQUÍ el mismo objeto firebaseConfig
  apiKey: 'AIzaSy...',
  authDomain: 'mi-pwa-notificaciones.firebaseapp.com',
  projectId: 'mi-pwa-notificaciones',
  storageBucket: 'mi-pwa-notificaciones.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
  // 👆 FIN
});

const messaging = firebase.messaging();
// ... resto del código
```

## 📌 Verificación Visual

### 1. DevTools - Console

Cuando inicies la app, deberías ver:

```
Console ▼
  ✅ Soporte para notificaciones: true
  ✅ Service Worker de Firebase registrado
  🔔 Solicitando permiso de notificaciones...
  ✅ Token FCM obtenido: eXaMpLe...
```

### 2. DevTools - Application

```
Application
├── Service Workers
│   ├── ✅ firebase-messaging-sw.js (activated)
│   └── ✅ service-worker-v2.js (activated)
│
└── Local Storage
    └── http://localhost:3000
        └── fcm-token: "eXaMpLe..."
```

### 3. Interfaz de Usuario

Después de activar notificaciones:

```
┌─────────────────────────────────────────┐
│  🔔 Notificaciones                      │
│  Recibirás notificaciones de la app    │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🧪 Enviar Notificación de Prueba  │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ Desactivar Notificaciones         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 📌 Notificación de Prueba

Al hacer clic en **"🧪 Enviar Notificación de Prueba"**:

### Notificación en Windows

```
┌─────────────────────────────────────────┐
│  Chrome                              [x]│
├─────────────────────────────────────────┤
│  🔔 ¡Notificación de Prueba!           │
│                                         │
│  Esta es una notificación enviada      │
│  desde tu PWA usando Firebase          │
│                                         │
│  hace unos segundos                    │
└─────────────────────────────────────────┘
```

### Notificación en macOS

```
┌─────────────────────────────────────────┐
│  Mi PWA                              [x]│
│  ─────────────────────────────────────  │
│  🔔 ¡Notificación de Prueba!           │
│                                         │
│  Esta es una notificación enviada      │
│  desde tu PWA usando Firebase          │
│                                         │
│  ahora                                 │
└─────────────────────────────────────────┘
```

## 📌 Enviar desde Firebase Console

También puedes probar enviando desde Firebase:

1. Firebase Console → **Messaging** (menú lateral)
2. Haz clic en **"Crear primera campaña"**

```
┌─────────────────────────────────────────┐
│  Crear campaña de mensajes              │
├─────────────────────────────────────────┤
│                                         │
│  Mensaje de notificación de Firebase   │
│  ┌──────────────────────┐              │
│  │  Enviar mensaje de   │              │
│  │  prueba               │ ← CLIC AQUÍ │
│  └──────────────────────┘              │
│                                         │
└─────────────────────────────────────────┘
```

3. Pega tu token FCM:

```
┌─────────────────────────────────────────┐
│  Enviar mensaje de prueba               │
├─────────────────────────────────────────┤
│                                         │
│  Token de registro de FCM:             │
│  ┌───────────────────────────────────┐ │
│  │ eXaMpLe...                        │ │
│  └───────────────────────────────────┘ │
│               [+]                       │
│                                         │
│  Tokens agregados:                     │
│  • eXaMpLe... (1)                      │
│                                         │
│              [Cancelar] [Prueba]       │
└─────────────────────────────────────────┘
```

4. Haz clic en **"Prueba"**
5. Deberías recibir la notificación inmediatamente

## 🎯 Checklist Visual

- [ ] ✅ Proyecto creado en Firebase Console
- [ ] ✅ App web registrada (ícono `</>`)
- [ ] ✅ firebaseConfig copiado
- [ ] ✅ VAPID key generada y copiada
- [ ] ✅ Credenciales pegadas en 3 archivos
- [ ] ✅ App iniciada con `npm run dev`
- [ ] ✅ Notificaciones activadas en navegador
- [ ] ✅ Token FCM visible en localStorage
- [ ] ✅ Notificación de prueba recibida
- [ ] ✅ Service Workers registrados correctamente

## 🆘 Problemas Comunes

### Error: "Firebase config is not defined"

```
❌ Console
  Error: Firebase config is not defined

✅ Solución:
  Verifica que hayas pegado firebaseConfig en:
  - src/config/firebase.ts (línea 4-10)
```

### Error: "Messaging: requested VAPID key is not valid"

```
❌ Console
  Error: Messaging: The public VAPID key is not valid

✅ Solución:
  1. Ve a Firebase Console → Cloud Messaging
  2. Genera nueva VAPID key si es necesario
  3. Copia la clave completa (empieza con "B")
  4. Pégala en firebasePushNotifications.ts
```

### No aparece el botón de notificaciones

```
❌ UI
  No se muestra la tarjeta de notificaciones

✅ Solución:
  1. Verifica que estés en HTTPS o localhost
  2. Revisa Console por errores de Firebase
  3. Asegúrate de que el navegador soporte notificaciones
```

---

**💡 Tip:** Guarda esta guía como referencia mientras configuras Firebase. Puedes marcar los checkboxes a medida que completas cada paso.
