const fileCache = 'file-v1';

const dataCache = 'data-v1';

const filesToCache = [
    '/',
    '/app.js',
    '/favicon.ico',
    '/index.html',
    '/manifest.webmanifest',
    '/assets/images/icons/icon-72x72.png',
    '/assets/images/icons/icon-96x96.png',
    '/assets/images/icons/icon-128x128.png',
    '/assets/images/icons/icon-144x144.png',
    '/assets/images/icons/icon-152x152.png',
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-384x384.png',
    '/assets/images/icons/icon-512x512.png'
];

//Cache static assets on install event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches
        .open(fileCache)
        .then(cache => {
            return cache.addAll(filesToCache);
        })
        .catch(err => {
            console.log('Error caching files on install: ', err)
        })
    );
    
    //Automatically update the service worker when changes are made 
    self.skipWaiting();
});

//Clear old caches for new material
self.addEventListener('active', (e) => {
    e.waitUntil(
        caches
        .keys()
        .then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== filesToCache && key !== dataCache) {
                        return caches.delete(key);
                    }
                })
            )
        })
        .catch(err => {
            console.log('Activation error: ', err)
        })
    );

    //If any clients are open, update them to the active SW
    self.clients.claim();
});