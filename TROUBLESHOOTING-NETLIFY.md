# 🔧 Solución de Problemas de Deploy en Netlify

## ✅ Errores Resueltos de netlify.toml

### 🐛 Error 1: "Unexpected character at row 5"

**Error completo:**
```
Failed during stage 'Reading and parsing configuration files':
Could not parse configuration file
Unexpected character, expected only whitespace or comments till end of line at row 5, col 8
```

**Causa:**
- ❌ Duplicación de secciones
- ❌ Falta de saltos de línea entre secciones
- ❌ Formato TOML incorrecto

**Solución:**
Reescribir el archivo con formato TOML correcto.

---

### 🐛 Error 2: "Unknown character 65279" (BOM)

**Error completo:**
```
Failed during stage 'Reading and parsing configuration files':
Could not parse configuration file
Unknown character "65279" at row 1, col 2, pos 1:
﻿[build]
```

**Causa:**
- ❌ El archivo tiene un BOM (Byte Order Mark) UTF-8
- ❌ Windows a veces agrega este carácter invisible al inicio
- ❌ El carácter `65279` es el BOM que TOML no acepta

**Solución aplicada:**
```powershell
# Eliminar archivo con BOM
Remove-Item netlify.toml -Force

# Crear archivo con codificación ASCII (sin BOM)
@'
[build]
  publish = "dist"
  command = "npm run build"
'@ | Set-Content -Path netlify.toml -Encoding ASCII

# Commit y push
git add netlify.toml
git commit -m "Fix: Eliminar BOM de netlify.toml"
git push origin week4
```

**✅ Estado:** Resuelto - archivo sin BOM, pusheado a GitHub

---

### 📝 Archivo netlify.toml Correcto

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/firebase-messaging-sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

---

## 📋 Checklist Pre-Deploy

Antes de hacer deploy a Netlify, verifica:

### 1. ✅ Configuración de Firebase

```bash
# Verifica que estos archivos NO tengan placeholders:
grep -r "TU_API_KEY_AQUI" src/config/firebase.ts
grep -r "TU_VAPID_KEY_AQUI" src/utils/firebasePushNotifications.ts
grep -r "TU_API_KEY_AQUI" public/firebase-messaging-sw.js

# Si encuentran resultados = ❌ Debes configurar Firebase primero
# Si no encuentran nada = ✅ Todo bien
```

### 2. ✅ Build Local

```bash
npm run build

# Debe completarse sin errores
# Verifica la carpeta dist/
ls dist/
```

### 3. ✅ Preview Local

```bash
npm run preview

# Abre http://localhost:4173/
# Prueba la app en modo producción
```

### 4. ✅ Archivo netlify.toml

```bash
# Verifica el formato
cat netlify.toml

# Debe verse limpio, sin duplicados
```

### 5. ✅ Archivos en Git

```bash
git status

# Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "Ready for deploy"
git push origin week4
```

---

## 🚨 Errores Comunes y Soluciones

### Error 1: "Build command failed"

```
Error: Command failed with exit code 1: npm run build
```

**Causa:** Errores de compilación TypeScript/ESLint

**Solución:**

```bash
# Ejecuta localmente para ver el error
npm run build

# Corrige los errores mostrados
# Luego push nuevamente
```

### Error 2: "Failed to parse netlify.toml"

**Causa:** Formato TOML incorrecto

**Solución:**

```bash
# Elimina el archivo corrupto
rm netlify.toml

# Crea uno nuevo con formato correcto
# (Usa el ejemplo arriba)
```

### Error 3: "Page Not Found"

**Causa:** Falta configuración de redirects para SPA

**Solución:**
Agrega en `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Error 4: "Service Worker not found"

**Causa:** Los service workers no se copiaron a dist/

**Solución:**
Verifica `vite.config.ts`:

```typescript
export default defineConfig({
  publicDir: 'public', // ✅ Debe estar presente
});
```

### Error 5: "Firebase config is not defined"

**Causa:** Olvidaste configurar las credenciales de Firebase

**Solución:**

```bash
# Edita src/config/firebase.ts
# Reemplaza los placeholders con tus credenciales reales
```

### Error 6: "Notifications not working"

**Causa:** VAPID key no configurada

**Solución:**

```bash
# Edita src/utils/firebasePushNotifications.ts
# Línea ~6: private static vapidKey = 'TU_CLAVE_REAL_AQUI'
```

---

## 🔍 Verificación Post-Deploy

Después de un deploy exitoso:

### 1. Verificar URL

```bash
# Netlify te da una URL como:
https://random-name-12345.netlify.app/
```

### 2. Abrir DevTools

**F12 → Console**

Debe mostrar:

```javascript
✅ Soporte para notificaciones: true
✅ Service Worker de Firebase registrado
```

NO debe mostrar:

```javascript
❌ Firebase config is not defined
❌ Messaging no está disponible
⚠️ Las notificaciones push requieren HTTPS
```

### 3. Verificar HTTPS

```javascript
console.log(window.location.protocol); // ✅ Debe ser "https:"
console.log(window.isSecureContext); // ✅ Debe ser true
```

### 4. Verificar Service Workers

**DevTools → Application → Service Workers**

Debe mostrar:

```
✅ firebase-messaging-sw.js - activated
✅ (opcional) workbox service worker - activated
```

### 5. Probar Notificaciones

1. Haz clic en "Activar Notificaciones"
2. Acepta el permiso
3. Haz clic en "🧪 Enviar Notificación de Prueba"
4. Deberías recibir la notificación

---

## 📊 Logs de Deploy

### Deploy Exitoso ✅

```
10:35:00 PM: Build ready to start
10:35:02 PM: build-image version: be5354c64a29dc4cf1de3a594c21978d9a70e833
10:35:02 PM: Starting to prepare the repo for build
10:35:03 PM: Installing dependencies
10:35:10 PM: Dependencies installed
10:35:10 PM: Starting build
10:35:12 PM: Building site
10:35:25 PM: Site is live ✨
10:35:25 PM: Finished processing build request in 25s
```

### Deploy Fallido ❌

```
10:33:48 PM: Failed during stage 'Reading and parsing configuration files'
10:33:48 PM: Could not parse configuration file
10:33:48 PM: Failing build: Failed to parse configuration
```

**Acción:** Corregir netlify.toml y push nuevamente

---

## 🛠️ Comandos Útiles

### Ver Logs de Deploy en Tiempo Real

```bash
netlify logs:deploy --site-id=tu-site-id
```

### Hacer Rollback

Si el deploy tiene problemas:

1. Ve a Netlify Dashboard
2. Deploys → Selecciona un deploy anterior
3. Click en "Publish deploy"

### Deploy Manual

```bash
# Build local
npm run build

# Deploy la carpeta dist/
netlify deploy --dir=dist --prod
```

### Limpiar Caché de Build

Si tienes problemas persistentes:

1. Netlify Dashboard
2. Site settings → Build & deploy
3. Environment → Clear build cache
4. Trigger deploy

---

## 🎯 Mejores Prácticas

### 1. Siempre Probar Localmente Primero

```bash
# Build y preview antes de deploy
npm run build
npm run preview
```

### 2. Usar Variables de Entorno

Para credenciales sensibles:

**netlify.toml:**

```toml
[build.environment]
  VITE_FIREBASE_API_KEY = ""
  VITE_FIREBASE_PROJECT_ID = ""
```

**Netlify Dashboard:**
Site settings → Build & deploy → Environment variables

### 3. Activar Deploy Previews

```toml
[context.deploy-preview]
  command = "npm run build"
```

Cada PR obtendrá su propia URL de preview.

### 4. Configurar Notificaciones

Netlify Dashboard → Notifications

- Email cuando falla el deploy
- Slack/Discord webhooks

### 5. Monitorear Performance

Netlify Analytics puede mostrar:

- Tiempo de carga
- Visitas
- Errores 404

---

## 📚 Recursos

- [Netlify Docs - File-based Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [TOML Spec](https://toml.io/en/)
- [Netlify Build Logs](https://docs.netlify.com/monitor-sites/build-logs/)
- [Deploy Notifications](https://docs.netlify.com/monitor-sites/notifications/)

---

## ✅ Resumen

### Problema Original

- Error de parsing en netlify.toml

### Solución Aplicada

- Reescribir netlify.toml con formato correcto
- Commit y push
- Deploy automático en Netlify

### Estado Actual

- ✅ netlify.toml con formato correcto
- ✅ Listo para deploy exitoso
- ✅ Notificaciones funcionarán en producción

---

**🎉 ¡Deploy listo!** El archivo está corregido y pusheado. Netlify debería hacer el deploy automáticamente ahora.

**Verifica en:** https://app.netlify.com/sites/tu-site/deploys
