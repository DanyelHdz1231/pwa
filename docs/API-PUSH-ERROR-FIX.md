# 🔧 Error: Cannot GET /api/push/subscribe - SOLUCIONADO ✅

## ❌ Problema

Al intentar suscribirse a notificaciones push, se recibía el error:

```
cannot GET /api/push/subscribe
```

## 🔍 Causa Raíz

La aplicación PWA (puerto 3000) intentaba hacer una petición POST a `/api/push/subscribe`, que se resolvía a `http://localhost:3000/api/push/subscribe` en lugar del servidor push en el puerto 3002.

### Flujo del Error:

```
PWA (puerto 3000)
  → fetch('/api/push/subscribe')  ❌ INCORRECTO
  → http://localhost:3000/api/push/subscribe  ❌ No existe

Debería ser:
  → fetch('http://localhost:3002/api/push/subscribe')  ✅ CORRECTO
  → http://localhost:3002/api/push/subscribe  ✅ Servidor push
```

## ✅ Solución Implementada

### 1. Actualización de `pushNotifications.ts`

```typescript
export class PushNotificationManager {
  private static vapidPublicKey = 'BAV7IGhd1Rg-D8GcuzAq_lHspniD424YHOy61qnQQqiUmgrXD-_gj0hehlzFknNHCKmh20b506dhSos2alx4TRM';
  private static pushServerUrl = 'http://localhost:3002'; // ✅ URL completa del servidor

  // ...

  // Uso en fetch:
  fetch(`${this.pushServerUrl}/api/push/subscribe`, {
    method: 'POST',
    // ...
  })
}
```

### 2. Actualización de Clave VAPID

Se actualizó la clave pública VAPID para que coincida con la generada por el servidor actual.

## 🧪 Verificación

### Servidor Push Funcionando:

```bash
# Endpoint de clave pública
GET http://localhost:3002/api/push/vapid-public-key
✅ Response: 200 OK

# Endpoint de suscripción
POST http://localhost:3002/api/push/subscribe
✅ Response: 200 OK
```

### Prueba desde PowerShell:

```powershell
# Obtener clave pública
Invoke-WebRequest -Uri "http://localhost:3002/api/push/vapid-public-key" -Method GET

# Probar suscripción
$body = @{endpoint="test"; keys=@{p256dh="test"; auth="test"}} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3002/api/push/subscribe" -Method POST -Body $body -ContentType "application/json"
```

## 🎯 Resultado

- ✅ URLs corregidas con puerto explícito
- ✅ Clave VAPID actualizada
- ✅ Servidor push verificado y funcionando
- ✅ Endpoint POST accesible desde la PWA

## 🚀 Cómo Usar Ahora

1. **Asegúrate de que el servidor push esté corriendo:**

   ```bash
   npm run push-server
   # Debe mostrar: 🚀 Servidor ejecutándose en http://localhost:3002
   ```

2. **Inicia la PWA:**

   ```bash
   npm run dev
   # Debe mostrar: ➜  Local: http://localhost:3000/
   ```

3. **Suscríbete a notificaciones:**
   - Abre `http://localhost:3000`
   - Haz clic en "Activar Notificaciones"
   - Acepta los permisos del navegador
   - ✅ La suscripción se enviará correctamente al servidor

4. **Verifica la consola:**
   - Navegador: `✅ Suscripción enviada correctamente al servidor push`
   - Servidor: `🔔 Nueva suscripción recibida`

## 💡 Nota para Producción

En producción, la URL del servidor push debe configurarse mediante variables de entorno:

```typescript
private static pushServerUrl = import.meta.env.VITE_PUSH_SERVER_URL || 'http://localhost:3002';
```

Archivo `.env`:

```
VITE_PUSH_SERVER_URL=https://tu-servidor-push.com
```
