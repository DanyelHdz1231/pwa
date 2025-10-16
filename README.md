# 📱 Mi PWA Avanzada - Week 4

Progressive Web App (PWA) con funcionalidades avanzadas: IndexedDB, Background Sync, Cache Strategies y **Firebase Cloud Messaging**.

## 🔥 **IMPORTANTE: Migración a Firebase**

Este proyecto ha sido migrado de VAPID a **Firebase Cloud Messaging (FCM)**.

### ⚡ Acción Requerida

**Antes de ejecutar la aplicación, debes configurar Firebase:**

1. **Lee la guía completa**: [`docs/FIREBASE-SETUP.md`](docs/FIREBASE-SETUP.md)
2. **Crea un proyecto en Firebase Console**
3. **Actualiza las credenciales** en estos archivos:
   - `src/config/firebase.ts`
   - `src/utils/firebasePushNotifications.ts`
   - `public/firebase-messaging-sw.js`

**📖 Detalles de la migración**: [`FIREBASE-MIGRATION.md`](FIREBASE-MIGRATION.md)

---

## ✨ Características

### 1. 💾 **IndexedDB**

- Almacenamiento local de actividades
- Persistencia de datos offline
- Sincronización automática cuando vuelve la conexión

### 2. 🔄 **Background Sync**

- Cola de sincronización para operaciones offline
- Reintento automático cuando hay conexión
- Indicador visual de estado de sincronización

### 3. 📦 **Cache Strategies**

- **Cache First**: Imágenes e íconos
- **Network First**: API y datos dinámicos
- **Stale While Revalidate**: Archivos estáticos (CSS, JS)

### 4. 🔔 **Push Notifications (Firebase)**

- Notificaciones push sin servidor backend
- Botón para enviar notificación de prueba
- Service Worker para notificaciones en segundo plano
- Gestión automática de tokens FCM

---

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

---

## 📋 Checklist de Configuración

### ✅ Paso 1: Instalar dependencias

```bash
npm install
```

### ✅ Paso 2: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Registra una aplicación web
4. Copia las credenciales

### ✅ Paso 3: Actualizar credenciales

**Archivo: `src/config/firebase.ts`**

```typescript
const firebaseConfig = {
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  // ... resto de credenciales
};
```

**Archivo: `src/utils/firebasePushNotifications.ts`**

```typescript
vapidKey: 'TU_VAPID_KEY_PUBLICA_AQUI';
```

**Archivo: `public/firebase-messaging-sw.js`**

```javascript
firebase.initializeApp({
  apiKey: 'TU_API_KEY_AQUI',
  // ... resto de credenciales
});
```

### ✅ Paso 4: Probar la aplicación

```bash
npm run dev
```

1. Abre http://localhost:3000
2. Haz clic en **"Activar Notificaciones"**
3. Acepta el permiso del navegador
4. Haz clic en **"🧪 Enviar Notificación de Prueba"**

---

## 🎯 Uso de la Aplicación

### Crear Actividad

1. Haz clic en **"Nueva Actividad"**
2. Completa el formulario
3. La actividad se guarda en IndexedDB
4. Se sincroniza automáticamente (si hay conexión)

### Ver Actividades

1. Haz clic en **"Mis Actividades"**
2. Filtra por categoría o prioridad
3. Edita o elimina actividades
4. Funciona offline

### Notificaciones Push

1. **Activar**: Haz clic en "Activar Notificaciones"
2. **Probar**: Usa el botón "🧪 Enviar Notificación de Prueba"
3. **Desactivar**: Haz clic en "Desactivar Notificaciones"

---

## 📁 Estructura del Proyecto

```
my-pwa/
├── public/
│   ├── firebase-messaging-sw.js     # Service Worker de Firebase
│   ├── service-worker-v2.js         # Service Worker principal
│   ├── offline.html                 # Página offline
│   └── icons/                       # Íconos de la PWA
├── src/
│   ├── components/
│   │   ├── ActivityForm.tsx         # Formulario de actividades
│   │   ├── ActivityList.tsx         # Lista de actividades
│   │   └── ConnectionStatus.tsx     # Indicador de conexión
│   ├── config/
│   │   └── firebase.ts              # ⚠️ Configuración de Firebase
│   ├── utils/
│   │   ├── database.ts              # Gestión de IndexedDB
│   │   └── firebasePushNotifications.ts  # ⚠️ Push con Firebase
│   ├── App.tsx                      # Componente principal
│   └── main.tsx                     # Punto de entrada
├── docs/
│   ├── FIREBASE-SETUP.md            # 📖 Guía de configuración Firebase
│   └── PWA-DOCUMENTATION.md         # Documentación completa
├── FIREBASE-MIGRATION.md            # 📋 Detalles de migración
└── package.json
```

**⚠️ Archivos que requieren configuración**

---

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **IndexedDB** (idb) - Base de datos local
- **Firebase** - Cloud Messaging
- **Service Workers** - Cache y background sync
- **Web Push API** - Notificaciones

---

## 🌐 Navegadores Soportados

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v15.4+)
- ✅ Opera (v76+)

---

## 📖 Documentación

- **Configuración Firebase**: [`docs/FIREBASE-SETUP.md`](docs/FIREBASE-SETUP.md)
- **Migración VAPID → Firebase**: [`FIREBASE-MIGRATION.md`](FIREBASE-MIGRATION.md)
- **Documentación PWA**: [`docs/PWA-DOCUMENTATION.md`](docs/PWA-DOCUMENTATION.md)

---

## 🐛 Solución de Problemas

### Las notificaciones no funcionan

1. Verifica que hayas configurado Firebase correctamente
2. Revisa que las credenciales sean correctas
3. Asegúrate de estar usando HTTPS o localhost
4. Comprueba que el service worker esté registrado

### Error: "Firebase config is not defined"

- Actualiza `src/config/firebase.ts` con tus credenciales

### Error: "Messaging: A problem occurred while subscribing"

- Verifica la VAPID key en `src/utils/firebasePushNotifications.ts`

### Más ayuda

Consulta [`docs/FIREBASE-SETUP.md`](docs/FIREBASE-SETUP.md) sección "Solución de Problemas"

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 3000)
npm run build        # Compilar para producción
npm run preview      # Preview de producción
npm run lint         # Ejecutar ESLint
```

---

## 🎉 Características Adicionales

### Estado de Conexión

Indicador visual en tiempo real del estado de conexión (online/offline)

### Instalación PWA

Botón para instalar la aplicación en el dispositivo

### Modo Offline

Toda la aplicación funciona sin conexión a internet

### Sincronización Automática

Los cambios se sincronizan automáticamente cuando vuelve la conexión

---

## 🔒 Seguridad

- ✅ HTTPS obligatorio en producción
- ✅ Tokens FCM únicos por dispositivo
- ✅ Permisos de notificaciones requeridos
- ✅ VAPID keys para autenticación

---

## 👨‍💻 Desarrollo

Este proyecto fue creado como parte de **Week 4** del curso de PWAs.

**Características implementadas:**

- [x] IndexedDB para almacenamiento offline
- [x] Background Sync para sincronización
- [x] Cache Strategies (3 estrategias diferentes)
- [x] Push Notifications con Firebase
- [x] Service Worker multi-estrategia
- [x] UI responsive y accesible

---

## 📄 Licencia

MIT

---

## 🆘 Necesitas Ayuda?

1. **Configuración Firebase**: Lee [`docs/FIREBASE-SETUP.md`](docs/FIREBASE-SETUP.md)
2. **Detalles de migración**: Lee [`FIREBASE-MIGRATION.md`](FIREBASE-MIGRATION.md)
3. **Documentación completa**: Lee [`docs/PWA-DOCUMENTATION.md`](docs/PWA-DOCUMENTATION.md)

---

**🎯 Siguiente paso:** Configura Firebase siguiendo la guía en `docs/FIREBASE-SETUP.md`

{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
