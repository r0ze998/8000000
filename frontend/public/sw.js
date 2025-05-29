// Service Worker for Cultural Shrine Village PWA
const CACHE_NAME = 'cultural-shrine-village-v1.0.0';
const STATIC_CACHE_NAME = 'cultural-shrine-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cultural-shrine-dynamic-v1.0.0';

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // PWA用最小限のリソース
];

// オフライン時のフォールバック
const OFFLINE_FALLBACK = '/offline.html';

// データベース関連のURL（オフライン対応）
const DATABASE_PATTERNS = [
  /\/api\/shrines/,
  /\/api\/cultural-data/,
  /\/api\/user-profile/
];

// インストール時
self.addEventListener('install', event => {
  console.log('SW: Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: Static assets cached');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('SW: Failed to cache static assets', err);
      })
  );
});

// アクティベート時
self.addEventListener('activate', event => {
  console.log('SW: Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Service Worker activated');
        return self.clients.claim();
      })
  );
});

// フェッチイベント（ネットワーク要求の処理）
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 神社・寺院データベースAPIの場合
  if (DATABASE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                // キャッシュから即座に返し、バックグラウンドで更新
                fetch(request)
                  .then(fetchResponse => {
                    if (fetchResponse.ok) {
                      cache.put(request, fetchResponse.clone());
                    }
                  })
                  .catch(() => {
                    // ネットワークエラーは無視（オフライン対応）
                  });
                return cachedResponse;
              } else {
                // キャッシュにない場合はネットワークから取得
                return fetch(request)
                  .then(fetchResponse => {
                    if (fetchResponse.ok) {
                      cache.put(request, fetchResponse.clone());
                    }
                    return fetchResponse;
                  })
                  .catch(() => {
                    // オフライン時のフォールバックデータ
                    return new Response(JSON.stringify({
                      offline: true,
                      message: 'オフラインモードです。一部の機能が制限されています。',
                      data: getCachedShrineData()
                    }), {
                      headers: { 'Content-Type': 'application/json' }
                    });
                  });
              }
            });
        })
    );
    return;
  }
  
  // 静的リソースの場合
  if (request.method === 'GET' && 
      (request.destination === 'document' || 
       request.destination === 'script' || 
       request.destination === 'style')) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            })
            .catch(() => {
              // オフライン時のフォールバック
              if (request.destination === 'document') {
                return caches.match('/');
              }
              throw new Error('Network unavailable');
            });
        })
    );
  }
});

// バックグラウンド同期
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered', event.tag);
  
  if (event.tag === 'shrine-visit-sync') {
    event.waitUntil(syncShrineVisits());
  } else if (event.tag === 'community-post-sync') {
    event.waitUntil(syncCommunityPosts());
  }
});

// プッシュ通知
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : '新しい文化イベントが開催されています！',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E⛩️%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E🔔%3C/text%3E%3C/svg%3E',
    tag: 'cultural-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: '確認する',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E👁️%3C/text%3E%3C/svg%3E'
      },
      {
        action: 'dismiss',
        title: '後で',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ctext y=".9em" font-size="90"%3E⏰%3C/text%3E%3C/svg%3E'
      }
    ],
    data: {
      url: '/?notification=true'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Cultural Shrine Village', options)
  );
});

// 通知クリック
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// オフライン時のフォールバックデータ
function getCachedShrineData() {
  return {
    shrines: [
      {
        id: 'offline-shrine-1',
        name: '明治神宮',
        location: '東京都渋谷区',
        description: 'オフラインモード - 詳細情報はオンライン時に表示されます',
        culturalValue: 100,
        rarity: 'legendary'
      },
      {
        id: 'offline-shrine-2',
        name: '伏見稲荷大社',
        location: '京都府京都市',
        description: 'オフラインモード - 詳細情報はオンライン時に表示されます',
        culturalValue: 130,
        rarity: 'legendary'
      }
    ],
    offline: true
  };
}

// 神社参拝データの同期
async function syncShrineVisits() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const pendingVisits = await cache.match('/pending-visits');
    
    if (pendingVisits) {
      const visits = await pendingVisits.json();
      
      for (const visit of visits) {
        try {
          const response = await fetch('/api/shrine-visits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(visit)
          });
          
          if (response.ok) {
            console.log('SW: Shrine visit synced successfully');
          }
        } catch (error) {
          console.error('SW: Failed to sync shrine visit', error);
        }
      }
      
      // 同期完了後、ペンディングデータを削除
      await cache.delete('/pending-visits');
    }
  } catch (error) {
    console.error('SW: Background sync failed', error);
  }
}

// コミュニティ投稿の同期
async function syncCommunityPosts() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const pendingPosts = await cache.match('/pending-posts');
    
    if (pendingPosts) {
      const posts = await pendingPosts.json();
      
      for (const post of posts) {
        try {
          const response = await fetch('/api/community-posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
          });
          
          if (response.ok) {
            console.log('SW: Community post synced successfully');
          }
        } catch (error) {
          console.error('SW: Failed to sync community post', error);
        }
      }
      
      await cache.delete('/pending-posts');
    }
  } catch (error) {
    console.error('SW: Background sync failed', error);
  }
}

// メッセージイベント（アプリからの指示）
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_SHRINE_DATA':
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => {
          cache.put('/shrine-data', new Response(JSON.stringify(data)));
        });
      break;
      
    case 'REQUEST_SYNC':
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        self.registration.sync.register(data.tag);
      }
      break;
      
    default:
      console.log('SW: Unknown message type', type);
  }
});

console.log('SW: Service Worker script loaded');