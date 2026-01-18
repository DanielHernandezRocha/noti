// Service Worker para PWA de Frases Filosóficas
// Compatible con OneSignal

const CACHE_NAME = 'frases-filosoficas-v1';

// Obtener ruta base desde la ubicación del Service Worker
function getBasePath() {
    const swPath = self.location.pathname;
    // Extraer la ruta base eliminando 'sw.js' del final
    const basePath = swPath.replace(/sw\.js$/, '');
    return basePath || '/';
}

// Construir URLs de cache relativas a la ruta base
function getCacheUrls(basePath) {
    const base = basePath.endsWith('/') ? basePath : basePath + '/';
    return [
        base,
        base + 'index.html',
        base + 'style.css',
        base + 'app.js',
        base + 'manifest.json',
        base + 'icon-192.png',
        base + 'icon-512.png'
    ];
}

const BASE_PATH = getBasePath();
console.log('Service Worker: Ruta base detectada:', BASE_PATH);
const urlsToCache = getCacheUrls(BASE_PATH);

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    console.log('Service Worker: URLs a cachear:', urlsToCache);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caché abierto');
                // Intentar cachear los recursos, pero continuar aunque algunos fallen
                return Promise.allSettled(
                    urlsToCache.map(url => 
                        cache.add(url).catch(err => {
                            console.warn(`Service Worker: Error al cachear ${url}:`, err);
                            return null;
                        })
                    )
                );
            })
            .catch((error) => {
                console.error('Service Worker: Error al cachear recursos:', error);
            })
    );
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Interceptar solicitudes de red (estrategia: Network First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clonar la respuesta
                const responseToCache = response.clone();
                
                // Almacenar en caché solo recursos GET
                if (event.request.method === 'GET') {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                
                return response;
            })
            .catch(() => {
                // Si falla la red, intentar servir desde caché
                return caches.match(event.request);
            })
    );
});

// Manejar notificaciones push (compatible con OneSignal)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Notificación push recibida');
    
    // Construir ruta del icono relativa a la ruta base
    const iconPath = BASE_PATH.endsWith('/') 
        ? BASE_PATH + 'icon-192.png' 
        : BASE_PATH + '/icon-192.png';
    
    let notificationData = {
        title: '🧠 Frase Filosófica',
        body: 'Tienes una nueva frase filosófica',
        icon: iconPath,
        badge: iconPath,
        tag: 'frase-filosofica',
        requireInteraction: false
    };

    // OneSignal envía los datos en event.data
    if (event.data) {
        try {
            const data = event.data.json();
            if (data.title) notificationData.title = data.title;
            if (data.body) notificationData.body = data.body;
            if (data.icon) notificationData.icon = data.icon;
            if (data.data) {
                // Datos adicionales de OneSignal
                notificationData.data = data.data;
            }
        } catch (e) {
            // Si no es JSON, usar como texto
            notificationData.body = event.data.text() || notificationData.body;
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: notificationData.tag,
            data: notificationData.data || {},
            requireInteraction: notificationData.requireInteraction
        })
    );
});

// Manejar clic en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notificación clickeada');
    
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                const baseUrl = BASE_PATH.endsWith('/') ? BASE_PATH : BASE_PATH + '/';
                const indexUrl = baseUrl + 'index.html';
                
                // Si hay una ventana abierta, enfocarla
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if ((client.url === baseUrl || client.url === indexUrl || client.url.includes(baseUrl)) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Si no hay ventana abierta, abrir una nueva
                if (clients.openWindow) {
                    return clients.openWindow(baseUrl);
                }
            })
    );
});

// Manejar notificaciones cerradas
self.addEventListener('notificationclose', (event) => {
    console.log('Service Worker: Notificación cerrada');
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    console.log('Service Worker: Mensaje recibido:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // Responder al cliente
    event.ports[0].postMessage({
        type: 'MESSAGE_RECEIVED',
        data: 'Service Worker activo'
    });
});

// Frases filosóficas para usar en notificaciones offline
const frasesOffline = [
    { texto: "La vida no examinada no vale la pena ser vivida", autor: "Sócrates" },
    { texto: "Pienso, luego existo", autor: "René Descartes" },
    { texto: "No se puede bañarse dos veces en el mismo río", autor: "Heráclito" }
];

console.log('Service Worker: Cargado y listo');
