const CACHE_NAME = 'caspian-v100'; // Сразу прыгаем на 100, чтобы сбить кэш

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Принудительно активируем новую версию
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key)) // Удаляем ВООБЩЕ ВСЁ старое
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request)); // Пока отключаем оффлайн-режим, чтобы видеть изменения сразу
});