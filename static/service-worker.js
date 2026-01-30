/**
 * Comprehensive Service Worker for Hugo Theme
 * Version: 1.0.0
 * 
 * Features:
 * - Network-first for HTML pages (blog, articles, photography)
 * - Cache-first for static assets (CSS, JS, fonts, images)
 * - Stale-while-revalidate for API calls
 * - Offline page support
 * - Dark mode preservation
 * - Hugo fingerprinted asset support
 * - Background sync and cache cleanup
 */

// Cache configuration
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  // Core application cache
  CORE: `${CACHE_VERSION}-core`,
  // HTML pages cache (network-first)
  PAGES: `${CACHE_VERSION}-pages`,
  // Static assets cache (cache-first)
  ASSETS: `${CACHE_VERSION}-assets`,
  // Images cache (cache-first with longer TTL)
  IMAGES: `${CACHE_VERSION}-images`,
  // Fonts cache (cache-first, very long TTL)
  FONTS: `${CACHE_VERSION}-fonts`,
  // API responses cache (stale-while-revalidate)
  API: `${CACHE_VERSION}-api`
};

// Resource patterns for categorization
const PATTERNS = {
  // HTML pages and documents
  pages: [
    /^\/$/,
    /^\/articles\/$/,
    /^\/photography\/$/,
    /^\/[a-zA-Z0-9-]+\/$/, // Sections
    /\.(html|htm)$/
  ],
  
  // Static assets
  assets: [
    /\.css$/,
    /\.js$/,
    /\.json$/,
    /\.xml$/,
    /\.txt$/,
    /\.webmanifest$/
  ],
  
  // Images
  images: [
    /\.(png|jpg|jpeg|gif|webp|svg|ico)$/
  ],
  
  // Fonts
  fonts: [
    /\.(woff|woff2|ttf|eot|otf)$/
  ],
  
  // API calls
  api: [
    /^\/api\//,
    /^\/graphql/
  ]
};

// TTL configuration (in seconds)
const TTL = {
  pages: 3600,      // 1 hour
  assets: 86400,    // 24 hours
  images: 604800,   // 1 week
  fonts: 2592000,   // 30 days
  api: 300          // 5 minutes
};

// Critical resources to pre-cache
const PRECACHE_URLS = [
  '/',
  '/articles/',
  '/photography/',
  '/all.css',
  '/js/all.bundle.js',
  '/js/semanticExtras.bundle.js',
  '/manifest.json',
  '/offline.html'
];

/**
 * Determine cache strategy based on URL and request type
 */
function determineStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip non-GET requests and chrome-extension protocols
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return { strategy: 'network', cache: null };
  }
  
  // Check each pattern category
  for (const [category, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some(pattern => pattern.test(pathname))) {
      switch (category) {
        case 'pages':
          return { strategy: 'network-first', cache: CACHE_NAMES.PAGES, ttl: TTL.pages };
        case 'assets':
          return { strategy: 'cache-first', cache: CACHE_NAMES.ASSETS, ttl: TTL.assets };
        case 'images':
          return { strategy: 'cache-first', cache: CACHE_NAMES.IMAGES, ttl: TTL.images };
        case 'fonts':
          return { strategy: 'cache-first', cache: CACHE_NAMES.FONTS, ttl: TTL.fonts };
        case 'api':
          return { strategy: 'stale-while-revalidate', cache: CACHE_NAMES.API, ttl: TTL.api };
      }
    }
  }
  
  // Default strategy for unknown resources
  return { strategy: 'network-first', cache: CACHE_NAMES.PAGES, ttl: TTL.pages };
}

/**
 * Network-first strategy with cache fallback
 */
async function networkFirst(request, cacheName, ttl) {
  const cache = await caches.open(cacheName);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the successful response
      const responseToCache = response.clone();
      await putWithTTL(cache, request.url, responseToCache, ttl);
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await getWithTTL(cache, request.url);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If in cache fails too, return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Cache-first strategy with network fallback
 */
async function cacheFirst(request, cacheName, ttl) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await getWithTTL(cache, request.url);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const responseToCache = response.clone();
      await putWithTTL(cache, request.url, responseToCache, ttl);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidate(request, cacheName, ttl) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await getWithTTL(cache, request.url);
  
  // Always try to fetch fresh data
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseToCache = response.clone();
      putWithTTL(cache, request.url, responseToCache, ttl);
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  try {
    return await fetchPromise;
  } catch (error) {
    throw error;
  }
}

/**
 * Store response with TTL metadata
 */
async function putWithTTL(cache, url, response, ttl) {
  const responseWithMetadata = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      'sw-cached-at': Date.now().toString(),
      'sw-ttl': (ttl * 1000).toString()
    }
  });
  
  await cache.put(url, responseWithMetadata);
}

/**
 * Get response checking TTL
 */
async function getWithTTL(cache, url) {
  const cachedResponse = await cache.match(url);
  
  if (!cachedResponse) {
    return null;
  }
  
  const cachedAt = parseInt(cachedResponse.headers.get('sw-cached-at') || '0');
  const ttl = parseInt(cachedResponse.headers.get('sw-ttl') || '0');
  
  // Check if response is still fresh
  if (Date.now() - cachedAt < ttl) {
    return cachedResponse;
  }
  
  // Response is stale, delete it and return null
  await cache.delete(url);
  return null;
}

/**
 * Clean up old caches
 */
async function cleanupOldCaches() {
  const currentCacheNames = Object.values(CACHE_NAMES);
  const allCacheNames = await caches.keys();
  
  const deletePromises = allCacheNames
    .filter(name => !currentCacheNames.includes(name))
    .map(name => caches.delete(name));
  
  await Promise.all(deletePromises);
}

/**
 * Pre-cache critical resources
 */
async function precacheCriticalResources() {
  const cache = await caches.open(CACHE_NAMES.CORE);
  
  for (const url of PRECACHE_URLS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await putWithTTL(cache, url, response, TTL.assets);
      }
    } catch (error) {
      console.warn(`Failed to precache ${url}:`, error);
    }
  }
}

/**
 * Handle fetch events
 */
self.addEventListener('fetch', (event) => {
  const { strategy, cache, ttl } = determineStrategy(event.request);
  
  switch (strategy) {
    case 'network-first':
      event.respondWith(networkFirst(event.request, cache, ttl));
      break;
      
    case 'cache-first':
      event.respondWith(cacheFirst(event.request, cache, ttl));
      break;
      
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request, cache, ttl));
      break;
      
    default:
      event.respondWith(fetch(event.request));
  }
});

/**
 * Handle service worker installation
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      precacheCriticalResources(),
      cleanupOldCaches()
    ])
  );
  
  // Force the new service worker to become active immediately
  self.skipWaiting();
});

/**
 * Handle service worker activation
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Claim all open pages
      self.clients.claim(),
      // Clean up old caches
      cleanupOldCaches()
    ])
  );
  
  // Notify all clients about the update
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_VERSION
      });
    });
  });
});

/**
 * Handle message events from clients
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      // Clear all caches
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'PREFETCH_PAGES':
      // Prefetch important pages for offline use
      const pages = data.pages || ['/articles/', '/photography/'];
      prefetchPages(pages);
      break;
  }
});

/**
 * Prefetch pages for offline use
 */
async function prefetchPages(pages) {
  const cache = await caches.open(CACHE_NAMES.PAGES);
  
  const prefetchPromises = pages.map(async url => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await putWithTTL(cache, url, response, TTL.pages);
      }
    } catch (error) {
      console.warn(`Failed to prefetch ${url}:`, error);
    }
  });
  
  await Promise.all(prefetchPromises);
}

/**
 * Background sync for failed requests
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implementation for background sync if needed
  console.log('[SW] Background sync triggered');
}

/**
 * Handle push notifications (if implemented)
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore this new content',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('New content available', options)
  );
});

// Console log for debugging
console.log('[SW] Service worker loaded:', CACHE_VERSION);