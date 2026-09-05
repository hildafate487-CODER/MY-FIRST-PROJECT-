const CACHE_NAME = "fate-budget-v4";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys =>
                Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {

                if (
                    response &&
                    response.status === 200
                ) {

                    const copy =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(
                                event.request,
                                copy
                            );
                        });
                }

                return response;

            })
            .catch(() => {

                return caches.match(
                    event.request
                );

            })
    );

});