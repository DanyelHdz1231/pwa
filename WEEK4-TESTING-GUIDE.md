# 📱 PWA Week 4 - Funcionalidades Avanzadas

## 🎯 Funcionalidades Implementadas

### ✅ 1. Formulario Offline con IndexedDB

- **Formulario de Actividades**: Permite crear, editar y eliminar actividades
- **Almacenamiento Local**: Usa IndexedDB con la librería `idb` para persistencia
- **Funciona Offline**: Los datos se guardan localmente y se sincronizan cuando vuelve la conexión

### ✅ 2. Background Sync

- **Sincronización Automática**: Los cambios se sincronizan cuando regresa la conexión
- **Cola de Sincronización**: Almacena operaciones pendientes en IndexedDB
- **Service Worker**: Maneja la sincronización en segundo plano

### ✅ 3. Estrategias de Caché Avanzadas

- **Cache First**: App Shell (HTML, CSS, JS)
- **Network First**: APIs y datos dinámicos
- **Stale While Revalidate**: Imágenes y recursos multimedia
- **Página Offline**: Página personalizada cuando no hay conexión

### ✅ 4. Notificaciones Push

- **Push API**: Registro y manejo de suscripciones
- **Claves VAPID**: Servidor con claves generadas automáticamente
- **Servidor de Prueba**: Endpoint para enviar notificaciones de testing

## 🚀 Cómo Probar la Aplicación

### 1. Iniciar los Servidores

```bash
# Terminal 1: Aplicación PWA
npm run dev
# Disponible en: http://localhost:3000

# Terminal 2: Servidor de Notificaciones Push
npm run push-server
# Disponible en: http://localhost:3002
```

O usar ambos al mismo tiempo:

```bash
npm run dev:full
```

### 2. Probar Funcionalidades Offline

1. **Abrir la PWA**: `http://localhost:3000`
2. **Crear Actividades**:
   - Ir a "Nueva Actividad"
   - Llenar el formulario y guardar
   - Las actividades se guardan en IndexedDB
3. **Probar Offline**:
   - Desconectar internet o usar DevTools → Network → Offline
   - Crear más actividades
   - Verificar que funciona sin conexión
4. **Ver Lista**:
   - Ir a "Lista" para ver todas las actividades
   - Filtrar por estado y categoría
   - Marcar como completadas

### 3. Probar Background Sync

1. **Con Conexión**:
   - Crear actividades normalmente
   - Se sincronizan inmediatamente
2. **Sin Conexión**:
   - Desconectar internet
   - Crear/editar actividades
   - Observar el ícono de sincronización pendiente 🔄
3. **Reconectar**:
   - Restaurar conexión
   - Las actividades se sincronizan automáticamente
   - Verificar en la consola del Service Worker

### 4. Probar Notificaciones Push

#### Paso 0: Limpiar Suscripciones Antiguas (si ya probaste antes)

```javascript
// En la consola del navegador
navigator.serviceWorker.ready.then((registration) => {
  registration.pushManager.getSubscription().then((subscription) => {
    if (subscription) {
      subscription.unsubscribe();
      console.log('✅ Suscripción antigua eliminada');
    }
  });
});

// Luego recargar la página
location.reload();
```

O usar el script de ayuda:

```javascript
// Cargar en la consola
fetch('/debug-push.js')
  .then((r) => r.text())
  .then(eval);

// Usar comandos
clearPushSubscription(); // Limpiar suscripción antigua
subscribePush(); // Nueva suscripción
sendTestNotification(); // Enviar prueba
```

#### Paso 1: Suscribirse

1. Abrir la PWA: `http://localhost:3000`
2. En la página de inicio, hacer clic en "Activar Notificaciones"
3. Permitir notificaciones cuando el navegador lo solicite
4. Verificar que se muestra "Desactivar Notificaciones"

#### Paso 2: Enviar Notificación desde el Servidor

```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3002/api/push/send-test" -Method POST

# O desde curl
curl -X POST http://localhost:3002/api/push/send-test
```

#### Paso 3: Verificar Suscripciones

- Abrir: `http://localhost:3002/api/push/subscriptions`
- Verificar que aparece la suscripción activa

#### Paso 4: Página de Prueba

- Abrir: `http://localhost:3002`
- Usar la interfaz web para enviar notificaciones

### 5. Probar Estrategias de Caché

1. **Cache First (App Shell)**:
   - Cargar la aplicación
   - Ir offline
   - Recargar la página → Debe cargar desde caché
2. **Network First (APIs)**:
   - Con conexión: Los datos se obtienen del servidor
   - Sin conexión: Se usan datos cacheados
3. **Página Offline**:
   - Ir offline
   - Navegar a una URL no cacheada
   - Debe mostrar la página offline personalizada

## 🛠️ Estructura del Proyecto

```
src/
├── components/
│   ├── ActivityForm.tsx        # Formulario de actividades
│   ├── ActivityList.tsx        # Lista de actividades
│   └── ConnectionStatus.tsx    # Indicador de conexión
├── utils/
│   ├── database.ts            # Manejo de IndexedDB
│   ├── backgroundSync.ts      # Background Sync utilities
│   └── pushNotifications.ts   # Push Notifications manager
└── App.tsx                    # Aplicación principal

public/
├── service-worker.js          # Service Worker con todas las estrategias
├── offline.html              # Página offline personalizada
└── push-server-simple.cjs    # Servidor de notificaciones push
```

## 🔑 Claves VAPID Generadas

La clave pública actual es:

```
BLHmunM9MmegPA5wYBQhsfaRrtzvbx_rzugiIDi1GKjz_cy5fAvDp9aHB7n_CCE1wGALK3bD86MmfNBjUNd-xZY
```

> **Nota**: Las claves se generan automáticamente cada vez que inicias el servidor. En producción, estas claves deben ser persistentes.

## 📊 Verificar Funcionamiento

### Consola del Navegador

```javascript
// Verificar IndexedDB
indexedDB.databases().then(console.log);

// Verificar Service Worker
navigator.serviceWorker.getRegistrations().then(console.log);

// Verificar notificaciones
Notification.permission;
```

### Chrome DevTools

1. **Application Tab**:
   - Storage → IndexedDB → PWADatabase
   - Service Workers → Verificar estado activo
   - Manifest → Verificar PWA
2. **Network Tab**:
   - Simular offline/online
   - Ver requests y caché

## 🎯 Evidencias de Funcionamiento

### Screenshots Requeridos

1. **Formulario funcionando offline** ✅
2. **Lista de actividades desde IndexedDB** ✅
3. **Indicador de conexión offline** ✅
4. **Notificación push recibida** ✅
5. **Página offline personalizada** ✅
6. **Service Worker activo en DevTools** ✅

### Logs del Servidor

El servidor muestra logs detallados de:

- Suscripciones recibidas
- Notificaciones enviadas
- Claves VAPID generadas

## 🔧 Troubleshooting

### Si las notificaciones no funcionan:

1. Verificar que el servidor push esté corriendo en puerto 3002
2. Verificar permisos de notificación en el navegador
3. Comprobar la consola para errores
4. Verificar que la clave VAPID esté actualizada

### Si IndexedDB no funciona:

1. Abrir DevTools → Application → Storage
2. Limpiar IndexedDB y recargar
3. Verificar la consola para errores de TypeScript

### Si Background Sync no funciona:

1. Verificar que el Service Worker esté activo
2. Simular offline/online en DevTools
3. Revisar la consola del Service Worker

## 🎉 ¡Aplicación Completamente Funcional!

La PWA ahora incluye todas las funcionalidades solicitadas para la Week 4:

- ✅ Offline form con IndexedDB
- ✅ Background Sync
- ✅ Estrategias de caché avanzadas
- ✅ Notificaciones Push con servidor VAPID

¡Listo para demostrar y capturar evidencias! 📱✨
