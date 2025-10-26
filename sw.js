const CACHE_NAME = 'bentre-travel-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/manifest.json',
    '/images/logo.png',
    // Thêm các tài nguyên cần cache
    '/images/huynhphu.jpg',
    '/images/dinhchieu.jpg',
    '/images/thanhgian.jpg',
    '/images/phutu.jpg',
    '/images/vinhtrang1.jpg',
    '/images/tuyenlinh.jpg',
    '/images/hoiton.jpg',
    '/images/lama.jpg',
    '/images/hoakieng.jpg',
    '/images/tanphu.jpg',
    '/images/vuondua.jpg',
    '/images/vamho.jpg',
    '/images/sinhthai.jpg',
    // Cache các file JavaScript
    '/sw.js',
    // Cache các font chữ
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    // Cache các thư viện
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Cài đặt Service Worker và cache các tài nguyên
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Xử lý các request
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Trả về response từ cache nếu có
                if (response) {
                    return response;
                }

                // Clone request vì nó chỉ có thể sử dụng một lần
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        // Kiểm tra response có hợp lệ không
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response vì nó chỉ có thể sử dụng một lần
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Trả về trang offline.html khi không có kết nối
                        return caches.match('/offline.html');
                    });
            })
    );
});

// Xóa cache cũ
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});