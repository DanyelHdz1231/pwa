// service-worker.js - Version 2 con Background Sync y estrategias avanzadas
const CACHE_NAME = 'mi-pwa-v2';
const APP_SHELL_CACHE = 'app-shell-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const STATIC_CACHE = 'static-v2';
const IMAGES_CACHE = 'images-v2';

// Página offline personalizada
const OFFLINE_PAGE = '/offline.html';

// Assets del App Shell - Cache First
const APP_SHELL_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/index.css',
    '/src/App.css',
    '/src/debug-fullwidth.css',
    '/vite.svg',
    '/icons/icon-192x192.svg',
    '/icons/icon-512x512.svg',
    OFFLINE_PAGE
];

// Patrones para diferentes estrategias
const API_PATTERNS = [
    /\/api\//,
    /\/sync\//
];

const IMAGE_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\/images\//,
    /\/assets\/.*\.(png|jpg|jpeg|svg|gif|webp)$/
];

// INSTALACIÓN: Cache First para App Shell
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v2 with Background Sync...');

    event.waitUntil(
        Promise.all([
            // Cachear App Shell
            caches.open(APP_SHELL_CACHE)
                .then((cache) => {
                    console.log('[SW] Caching App Shell');
                    return cache.addAll(APP_SHELL_ASSETS);
                }),
            // Pre-crear otros caches
            caches.open(DYNAMIC_CACHE),
            caches.open(STATIC_CACHE),
            caches.open(IMAGES_CACHE)
        ])
        .then(() => {
            console.log('[SW] App Shell cached successfully');
            return self.skipWaiting();
        })
        .catch((error) => {
            console.error('[SW] Error caching App Shell:', error);
        })
    );
});

// ACTIVACIÓN: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== APP_SHELL_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== STATIC_CACHE && 
                            cacheName !== IMAGES_CACHE) {
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

// FETCH: Estrategias de caché diferenciadas
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Solo manejar requests HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }

    // 1. CACHE FIRST - App Shell
    if (APP_SHELL_ASSETS.some(asset => url.pathname === asset || url.pathname.startsWith(asset))) {
        event.respondWith(cacheFirstStrategy(request, APP_SHELL_CACHE));
        return;
    }

    // 2. NETWORK FIRST - APIs y datos dinámicos
    if (API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
        return;
    }

    // 3. STALE WHILE REVALIDATE - Imágenes
    if (IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        event.respondWith(staleWhileRevalidateStrategy(request, IMAGES_CACHE));
        return;
    }

    // 4. NETWORK FIRST con fallback offline - Rutas dinámicas
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.open(APP_SHELL_CACHE)
                        .then(cache => cache.match(OFFLINE_PAGE));
                })
        );
        return;
    }

    // 5. CACHE FIRST - Otros recursos estáticos
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

// ESTRATEGIAS DE CACHÉ

// Cache First: Busca en caché primero, luego red
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[SW] Cache hit:', request.url);
            return cachedResponse;
        }

        console.log('[SW] Cache miss, fetching:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First error:', error);
        throw error;
    }
}

// Network First: Busca en red primero, luego caché
async function networkFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        
        try {
            console.log('[SW] Network first, fetching:', request.url);
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (networkError) {
            console.log('[SW] Network failed, trying cache:', request.url);
            const cachedResponse = await cache.match(request);
            
            if (cachedResponse) {
                return cachedResponse;
            }
            
            throw networkError;
        }
    } catch (error) {
        console.error('[SW] Network First error:', error);
        throw error;
    }
}

// Stale While Revalidate: Devuelve caché y actualiza en segundo plano
async function staleWhileRevalidateStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        // Actualizar caché en segundo plano
        const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        }).catch(error => {
            console.log('[SW] Background fetch failed:', error);
        });

        // Devolver caché si existe, sino esperar red
        if (cachedResponse) {
            console.log('[SW] Stale while revalidate, cache hit:', request.url);
            fetchPromise; // Fire and forget
            return cachedResponse;
        } else {
            console.log('[SW] Stale while revalidate, cache miss:', request.url);
            return await fetchPromise;
        }
    } catch (error) {
        console.error('[SW] Stale While Revalidate error:', error);
        throw error;
    }
}

// BACKGROUND SYNC - Sincronización en segundo plano
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync event:', event.tag);

    if (event.tag === 'sync-activities') {
        event.waitUntil(syncActivities());
    }
});

// Función para sincronizar actividades
async function syncActivities() {
    try {
        console.log('[SW] Starting background sync...');
        
        // Abrir IndexedDB para obtener elementos pendientes de sincronización
        const dbRequest = indexedDB.open('PWADatabase', 1);
        
        dbRequest.onsuccess = async (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['sync_queue'], 'readwrite');
            const store = transaction.objectStore('sync_queue');
            
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = async () => {
                const syncItems = getAllRequest.result;
                console.log('[SW] Found sync items:', syncItems.length);
                
                for (const item of syncItems) {
                    try {
                        await syncSingleItem(item);
                        // Eliminar item sincronizado
                        store.delete(item.id);
                        console.log('[SW] Synced and removed item:', item.id);
                    } catch (error) {
                        console.error('[SW] Failed to sync item:', item.id, error);
                    }
                }
            };
        };
        
        console.log('[SW] Background sync completed');
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
        throw error;
    }
}

// Sincronizar un elemento individual
async function syncSingleItem(item) {
    const { action, data, endpoint } = item;
    
    const options = {
        method: action === 'create' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: action !== 'delete' ? JSON.stringify(data) : undefined,
    };
    
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

// PUSH NOTIFICATIONS - Manejo de notificaciones push
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');
    
    const options = {
        body: 'Tienes nuevas actualizaciones en tu PWA',
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        tag: 'pwa-notification',
        actions: [
            {
                action: 'view',
                title: 'Ver App',
                icon: '/icons/icon-72x72.svg'
            },
            {
                action: 'dismiss',
                title: 'Cerrar',
                icon: '/icons/icon-72x72.svg'
            }
        ]
    };

    if (event.data) {
        const payload = event.data.json();
        options.body = payload.body || options.body;
        options.title = payload.title || 'Mi PWA';
    }

    event.waitUntil(
        self.registration.showNotification('Mi PWA', options)
    );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('[SW] Service Worker v2 loaded with Background Sync and Push Notifications');