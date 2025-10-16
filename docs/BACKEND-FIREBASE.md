# 🚀 Enviar Notificaciones desde Backend (Opcional)

Si deseas enviar notificaciones desde un servidor backend en lugar de solo desde el frontend, puedes usar la Firebase Admin SDK.

## 📦 Instalación

### Node.js Backend

```bash
npm install firebase-admin
```

## 🔑 Obtener Credenciales de Service Account

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **⚙️ Configuración del proyecto** → **Cuentas de servicio**
4. Haz clic en **"Generar nueva clave privada"**
5. Descarga el archivo JSON (guárdalo como `serviceAccountKey.json`)

⚠️ **IMPORTANTE:** Este archivo contiene credenciales sensibles. Nunca lo subas a Git.

Agrega al `.gitignore`:

```
serviceAccountKey.json
```

## 💻 Ejemplo de Servidor Node.js

### Archivo: `server-firebase.js`

```javascript
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para enviar notificación
app.post('/api/send-notification', async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token FCM requerido' });
    }

    const message = {
      notification: {
        title: title || 'Notificación',
        body: body || 'Has recibido una nueva notificación',
      },
      data: data || {},
      token: token,
    };

    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);

    res.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({
      error: 'Error al enviar notificación',
      details: error.message,
    });
  }
});

// Endpoint para enviar a múltiples dispositivos
app.post('/api/send-notification-batch', async (req, res) => {
  try {
    const { tokens, title, body } = req.body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: 'Array de tokens requerido' });
    }

    const message = {
      notification: {
        title: title || 'Notificación',
        body: body || 'Has recibido una nueva notificación',
      },
    };

    const response = await admin.messaging().sendEachForMulticast({
      ...message,
      tokens: tokens,
    });

    console.log(
      `${response.successCount} notificaciones enviadas exitosamente`
    );
    console.log(`${response.failureCount} notificaciones fallaron`);

    res.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    });
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
    res.status(500).json({
      error: 'Error al enviar notificaciones',
      details: error.message,
    });
  }
});

// Endpoint para enviar a un tema (topic)
app.post('/api/send-notification-topic', async (req, res) => {
  try {
    const { topic, title, body } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic requerido' });
    }

    const message = {
      notification: {
        title: title || 'Notificación',
        body: body || 'Has recibido una nueva notificación',
      },
      topic: topic,
    };

    const response = await admin.messaging().send(message);
    console.log('Notificación enviada al topic:', response);

    res.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error('Error al enviar notificación al topic:', error);
    res.status(500).json({
      error: 'Error al enviar notificación',
      details: error.message,
    });
  }
});

// Suscribir dispositivo a un tema
app.post('/api/subscribe-topic', async (req, res) => {
  try {
    const { token, topic } = req.body;

    if (!token || !topic) {
      return res.status(400).json({ error: 'Token y topic requeridos' });
    }

    const response = await admin.messaging().subscribeToTopic(token, topic);
    console.log('Suscrito al topic:', topic);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Error al suscribir al topic:', error);
    res.status(500).json({
      error: 'Error al suscribir',
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Firebase corriendo en http://localhost:${PORT}`);
});
```

## 🎯 Uso del Backend

### 1. Instalar dependencias

```bash
npm install firebase-admin express cors
```

### 2. Iniciar servidor

```bash
node server-firebase.js
```

### 3. Enviar notificación desde el frontend

Actualiza `src/utils/firebasePushNotifications.ts`:

```typescript
static async sendNotificationFromBackend(title: string, body: string) {
  try {
    const token = localStorage.getItem('fcm-token');
    if (!token) {
      throw new Error('No hay token FCM guardado');
    }

    const response = await fetch('http://localhost:3002/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        title,
        body,
        data: {
          url: window.location.origin,
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar notificación');
    }

    const result = await response.json();
    console.log('Notificación enviada desde backend:', result);
    return result;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 4. Usar en App.tsx

```typescript
const handleSendBackendNotification = async () => {
  try {
    await FirebasePushManager.sendNotificationFromBackend(
      '🎉 Notificación desde Backend',
      'Esta notificación fue enviada desde el servidor'
    );
    alert('¡Notificación enviada desde el backend!');
  } catch (error) {
    console.error('Error:', error);
    alert('Error al enviar notificación');
  }
};
```

## 📬 Ejemplos de Peticiones

### Enviar a un dispositivo

```bash
curl -X POST http://localhost:3002/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TU_TOKEN_FCM_AQUI",
    "title": "¡Hola!",
    "body": "Esta es una notificación de prueba"
  }'
```

### Enviar a múltiples dispositivos

```bash
curl -X POST http://localhost:3002/api/send-notification-batch \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": ["token1", "token2", "token3"],
    "title": "Notificación masiva",
    "body": "Mensaje para todos"
  }'
```

### Enviar a un tema

```bash
curl -X POST http://localhost:3002/api/send-notification-topic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "noticias",
    "title": "Nueva noticia",
    "body": "Lee las últimas noticias"
  }'
```

### Suscribir a un tema

```bash
curl -X POST http://localhost:3002/api/subscribe-topic \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TU_TOKEN_FCM_AQUI",
    "topic": "noticias"
  }'
```

## 🎨 Notificación con imagen y acción

```javascript
const message = {
  notification: {
    title: 'Nueva actualización',
    body: 'Haz clic para ver más detalles',
  },
  webpush: {
    notification: {
      icon: 'https://tu-app.com/icon.png',
      image: 'https://tu-app.com/banner.jpg',
      badge: 'https://tu-app.com/badge.png',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Abrir app',
        },
        {
          action: 'dismiss',
          title: 'Cerrar',
        },
      ],
    },
    fcm_options: {
      link: 'https://tu-app.com',
    },
  },
  token: token,
};

await admin.messaging().send(message);
```

## 📊 Ventajas del Backend

- ✅ **Seguridad**: Las credenciales están en el servidor
- ✅ **Lógica de negocio**: Envía notificaciones basadas en eventos
- ✅ **Programación**: Envía notificaciones en horarios específicos
- ✅ **Integraciones**: Conecta con bases de datos, APIs, etc.
- ✅ **Análisis**: Registra y analiza el envío de notificaciones

## 🔒 Seguridad

### Variables de entorno

En lugar de usar el archivo JSON directamente, usa variables de entorno:

```javascript
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});
```

### Archivo `.env`

```bash
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"
PORT=3002
```

## 🚀 Deploy

### Heroku

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Crear app
heroku create mi-app-notificaciones

# Configurar variables de entorno
heroku config:set FIREBASE_PROJECT_ID=tu-proyecto
heroku config:set FIREBASE_CLIENT_EMAIL=xxxxx@iam.gserviceaccount.com
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN..."

# Deploy
git push heroku main
```

### Railway / Render / Vercel

Similar a Heroku, pero verifica la documentación específica de cada plataforma.

## 📚 Recursos

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Enviar mensajes con Admin SDK](https://firebase.google.com/docs/cloud-messaging/send-message)
- [Temas de FCM](https://firebase.google.com/docs/cloud-messaging/js/topic-messaging)

---

**💡 Nota:** Este backend es opcional. La aplicación funciona perfectamente solo con Firebase desde el frontend.
