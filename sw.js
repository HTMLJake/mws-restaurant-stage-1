let index = 1;
const StaticCacheName = "Cache-";

//test

self.addEventListener("fetch", function (event) {
    let e = event.request;
    let url = event.request.url;

    event.respondWith(
        caches.match(e).then(function (response) {
            return response ? response : fetch(e);    
        })
    );

    /* event.waitUntil(
        caches.open(`${StaticCacheName}${index}`).then(function (cache) {
            return cache.add(url.includes('googleapi') ? "" : url);
        })
    ); */
});
//Array of urls to cache
let itemsToCache = ['index.html','restaurant.html','/','data/restaurants.json','css/styles.css','js/dbhelper.js','js/main.js', 'js/restaurant_info.js'];

self.addEventListener("install", function (event) {
        caches.open(`${StaticCacheName}${index}`).then(function (cache) {
            //I am looping through each add adding them individually so if I spell a url wrong in the array I can catch it
            itemsToCache.forEach(item => {
                return cache.add(item).catch(function (e) {
                  console.error(item + " does not exist!");
                  console.error(e);  
                });
            });
        }).catch(function (err) {
            console.error(err);
        });
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (CacheNames) {
            return Promise.all(
                CacheNames.filter(function (cache) {
                    return cache.startsWith(StaticCacheName) && !cache.endsWith(index);
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});