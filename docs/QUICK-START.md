# ⚡ Quick Start - Firebase PWA

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Configurar Firebase

#### A. Crear proyecto

1. Ve a https://console.firebase.google.com/
2. **"Agregar proyecto"** → Nombre: `mi-pwa`
3. Desactiva Analytics (opcional)

#### B. Registrar app web

1. Haz clic en ícono **Web** (`</>`)
2. Nombre: `Mi PWA`
3. **Copiar** el código de configuración

#### C. Generar VAPID key

1. **⚙️ Configuración** → **Cloud Messaging**
2. **"Generar par de claves"**
3. **Copiar** la clave pública

### 3️⃣ Actualizar 3 archivos

#### Archivo 1: `src/config/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: 'PEGA_AQUI',
  authDomain: 'PEGA_AQUI',
  projectId: 'PEGA_AQUI',
  storageBucket: 'PEGA_AQUI',
  messagingSenderId: 'PEGA_AQUI',
  appId: 'PEGA_AQUI',
};
```

#### Archivo 2: `src/utils/firebasePushNotifications.ts` (línea 18)

```typescript
vapidKey: 'PEGA_VAPID_KEY_AQUI';
```

#### Archivo 3: `public/firebase-messaging-sw.js` (línea 4)

```javascript
firebase.initializeApp({
  apiKey: 'PEGA_AQUI',
  authDomain: 'PEGA_AQUI',
  projectId: 'PEGA_AQUI',
  storageBucket: 'PEGA_AQUI',
  messagingSenderId: 'PEGA_AQUI',
  appId: 'PEGA_AQUI',
});
```

### 4️⃣ Ejecutar

```bash
npm run dev
```

### 5️⃣ Probar

1. Abre http://localhost:3000
2. **"Activar Notificaciones"** → Aceptar
3. **"🧪 Enviar Notificación de Prueba"**
4. ✅ Deberías recibir una notificación

---

## 📚 Documentación Completa

Si necesitas más detalles:

| Documento                                                     | Descripción                 |
| ------------------------------------------------------------- | --------------------------- |
| [`README.md`](../README.md)                                   | Visión general del proyecto |
| [`docs/FIREBASE-SETUP.md`](./FIREBASE-SETUP.md)               | Guía detallada paso a paso  |
| [`docs/FIREBASE-VISUAL-GUIDE.md`](./FIREBASE-VISUAL-GUIDE.md) | Guía con capturas visuales  |
| [`FIREBASE-MIGRATION.md`](../FIREBASE-MIGRATION.md)           | Qué cambió en la migración  |
| [`IMPLEMENTATION-SUMMARY.md`](../IMPLEMENTATION-SUMMARY.md)   | Resumen técnico completo    |

---

## 🆘 Solución de Problemas

### Error: "Firebase config is not defined"

```bash
# Verifica que hayas pegado las credenciales en:
# src/config/firebase.ts
```

### Error: "Messaging: A problem occurred while subscribing"

```bash
# Verifica la VAPID key en:
# src/utils/firebasePushNotifications.ts (línea 18)
```

### No aparece el permiso de notificaciones

```bash
# Asegúrate de estar en:
# - HTTPS (producción)
# - localhost (desarrollo)
```

---

## 📦 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linter
npm run lint
```

---

## ✅ Checklist

- [ ] `npm install` ejecutado
- [ ] Proyecto creado en Firebase Console
- [ ] `firebaseConfig` pegado en `src/config/firebase.ts`
- [ ] VAPID key pegada en `src/utils/firebasePushNotifications.ts`
- [ ] Credenciales pegadas en `public/firebase-messaging-sw.js`
- [ ] `npm run dev` funciona sin errores
- [ ] Notificaciones activadas
- [ ] Notificación de prueba recibida

---

**🎉 ¡Listo! Tu PWA con Firebase está funcionando.**

Si algo no funciona, consulta [`docs/FIREBASE-SETUP.md`](./FIREBASE-SETUP.md)
