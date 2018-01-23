let index = 7;
const StaticCacheName = "Cache-";

self.addEventListener("fetch", function (event) {
    let e = event.request;
    let url = event.request.url;

    event.respondWith(
        caches.match(e).then(function (response) {
            return response ? response : fetch(e);    
        })
    );

    event.waitUntil(
        caches.open(`${StaticCacheName}${index}`).then(function (cache) {
            return cache.add(url.includes('googleapi') ? "" : url);
        })
    );
});

self.addEventListener("install", function (event) {
    caches.open(`${StaticCacheName}${index}`);
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (CacheNames) {
            return Promise.all(
                CacheNames.filter(function (cache) {
                    return cache.startsWith(StaticCacheName) && !cache.endsWith(index);
                }).map(function (cacheName) {
                    //return caches.delete(cacheName);
                })
            );
        })
    );
});