const CACHE_NAME = 'withday-v1';
const OFFLINE_URL = '/';

// キャッシュするファイル
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
];

// Service Workerインストール
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Service Worker有効化
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// フェッチイベント（オフライン対応）
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// プッシュ通知受信
self.addEventListener('push', (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || 'Withday';
    const options = {
        body: data.body || '予定の時間です',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'withday-notification',
        data: data.data || {},
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 通知クリック時
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // 既存のウィンドウがあればフォーカス
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // なければ新しいウィンドウを開く
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// スケジュール通知（ローカル通知用）
self.addEventListener('message', (event) => {
    if (event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { title, body, scheduledTime, tag } = event.data;
        const delay = scheduledTime - Date.now();

        if (delay > 0) {
            setTimeout(() => {
                self.registration.showNotification(title, {
                    body,
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    vibrate: [200, 100, 200],
                    tag,
                });
            }, delay);
        }
    }
});
