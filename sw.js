// sw.js

const CACHE_NAME = 'codelab-task-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './assets/style/style.css',
    './assets/task.js', // Ajusta según tu estructura
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',
    'https://kit.fontawesome.com/bfda0355a9.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/toastify-js',
    'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'
];

// Instalar el Service Worker y cachear los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar las solicitudes y servir desde caché si está disponible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retornar la respuesta desde el caché o realizar una solicitud de red
                return response || fetch(event.request);
            })
    );
});

// Actualizar el Service Worker y limpiar el caché antiguo
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            console.log('Borrando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});
