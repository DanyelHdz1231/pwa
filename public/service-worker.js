// service-worker.js
const CACHE_NAME = 'mi-pwa-v1';
const APP_SHELL_CACHE = 'app-shell-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets del App Shell que se cachean durante la instalación
const APP_SHELL_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/index.css',
    '/src/App.css',
    '/vite.svg',
    '/icons/icon-192x192.svg',
    '/icons/icon-512x512.svg'
];

// Estrategia: Cache First para assets del App Shell
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');

    event.waitUntil(
        caches.open(APP_SHELL_CACHE)
            .then((cache) => {
                console.log('[SW] Caching App Shell');
                return cache.addAll(APP_SHELL_ASSETS);
            })
            .then(() => {
                console.log('[SW] App Shell cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Error caching App Shell:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar caches obsoletos
                        if (cacheName !== APP_SHELL_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Estrategias de cacheo para diferentes tipos de requests
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Solo cachear requests del mismo origen
    if (url.origin === location.origin) {

        // Estrategia Cache First para App Shell assets
        if (APP_SHELL_ASSETS.includes(url.pathname) || url.pathname === '/') {
            event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
            return;
        }

        // Estrategia Network First para assets dinámicos
        if (url.pathname.startsWith('/src/') || url.pathname.startsWith('/icons/')) {
            event.respondWith(networkFirst(request, DYNAMIC_CACHE));
            return;
        }

        // Estrategia Cache First para otros assets estáticos
        if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2)$/)) {
            event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
            return;
        }
    }

    // Para todo lo demás, ir directo a la red
    event.respondWith(fetch(request));
});

// Estrategia Cache First
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        // Cachear la respuesta si es exitosa
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            console.log('[SW] Cached new resource:', request.url);
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First failed:', error);

        // Fallback offline para navegación
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }

        // Fallback para imágenes
        if (request.destination === 'image') {
            return caches.match('/vite.svg');
        }

        throw error;
    }
}

// Estrategia Network First
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);

        // Cachear la respuesta si es exitosa
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            console.log('[SW] Updated cache:', request.url);
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Background Sync (cuando esté disponible)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('[SW] Background sync triggered');
        // Aquí puedes implementar sincronización en background
    }
});

// Push Notifications (preparado para futuro uso)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        console.log('[SW] Push notification received:', data);

        const options = {
            body: data.body || 'Nueva notificación',
            icon: '/icons/icon-192x192.svg',
            badge: '/icons/icon-72x72.svg',
            vibrate: [100, 50, 100],
            data: data.data || {},
            actions: data.actions || []
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'Mi PWA', options)
        );
    }
});

console.log('[SW] Service Worker loaded successfully');