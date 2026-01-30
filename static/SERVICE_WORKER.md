# Service Worker Implementation for Hugo Theme

This document describes the comprehensive service worker implementation for the Espouse Hugo theme, providing intelligent caching strategies and robust offline functionality.

## Overview

The service worker implementation consists of three main components:

1. **Service Worker (`service-worker.js`)** - Core caching logic and offline functionality
2. **Service Worker Manager (`sw-manager.js`)** - Registration, updates, and user notifications
3. **Offline Page (`offline.html`)** - Custom offline experience with navigation options

## Features

### Intelligent Caching Strategies

| Resource Type | Strategy | Cache Name | TTL | Purpose |
|---------------|----------|------------|-----|---------|
| HTML Pages | Network-First | `pages` | 1 hour | Always serve fresh content, fallback to cache |
| Static Assets (CSS/JS) | Cache-First | `assets` | 24 hours | Fast loading, updates on cache invalidation |
| Images | Cache-First | `images` | 1 week | Reduce bandwidth, improve performance |
| Fonts | Cache-First | `fonts` | 30 days | Persistent caching for typography |
| API Calls | Stale-While-Revalidate | `api` | 5 minutes | Fresh data with offline fallback |

### Hugo-Specific Optimizations

- **Fingerprinted Asset Support**: Works seamlessly with Hugo's asset fingerprinting
- **Build System Integration**: Automatically disabled in development server
- **Multilingual Support**: Handles language-specific content caching
- **Static Site Optimization**: Optimized for Hugo's static file structure

### Offline Functionality

- **Custom Offline Page**: Beautiful offline experience with navigation options
- **Dark Mode Preservation**: Maintains user's dark mode preference across offline sessions
- **Graceful Degradation**: Dynamic features work offline when possible
- **Connection Monitoring**: Real-time connection status updates

### Performance Optimizations

- **Preload Critical Resources**: Essential assets cached on first visit
- **Background Sync**: Handles failed requests when connection is restored
- **Cache Cleanup**: Automatic cleanup of expired cache entries
- **Selective Caching**: Only cache resources that benefit from caching

## File Structure

```
static/
├── service-worker.js          # Main service worker
├── js/
│   └── sw-manager.js         # Service worker manager
└── offline.html               # Custom offline page

layouts/
├── _default/
│   └── baseof.html           # Updated with SW registration
└── partials/
    ├── service-worker.html   # Hugo partial for SW registration
    └── javascript.html       # Updated with SW manager
```

## Configuration

### Service Worker Configuration

The service worker can be configured by modifying the constants in `service-worker.js`:

```javascript
const CACHE_VERSION = 'v1.0.0';
const TTL = {
  pages: 3600,      // 1 hour
  assets: 86400,    // 24 hours
  images: 604800,   // 1 week
  fonts: 2592000,   // 30 days
  api: 300          // 5 minutes
};
```

### Hugo Integration

The service worker is automatically registered in production builds. To control this behavior:

```hugo
# In your Hugo config
[params]
  enableServiceWorker = true  # Default: true
```

## Usage

### Manual Service Worker Control

The service worker manager provides a JavaScript API for manual control:

```javascript
// Check if service worker is supported
if (window.swManager.isSupported) {
  // Get current version
  console.log(window.swManager.version);
  
  // Check connection status
  console.log('Online:', window.swManager.isOnline());
  
  // Check for updates
  if (window.swManager.isUpdateAvailable()) {
    window.swManager.update();
  }
  
  // Clear all caches
  window.swManager.clearCaches();
  
  // Preload offline content
  window.swManager.preload();
}
```

### Custom Event Handling

Listen for service worker events:

```javascript
// Service worker updated
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('Service worker updated, page will reload');
});

// Connection status changes
window.addEventListener('online', () => {
  console.log('Back online');
});

window.addEventListener('offline', () => {
  console.log('Gone offline');
});
```

## Cache Management

### Cache Names

The service worker uses versioned cache names for easy invalidation:

- `v1.0.0-core` - Critical resources
- `v1.0.0-pages` - HTML pages
- `v1.0.0-assets` - Static assets
- `v1.0.0-images` - Images
- `v1.0.0-fonts` - Fonts
- `v1.0.0-api` - API responses

### Cache Cleanup

Old caches are automatically cleaned up when the service worker updates. You can also manually clear caches:

```javascript
// Clear all caches via the manager
window.swManager.clearCaches().then(success => {
  console.log('Caches cleared:', success);
});
```

## Testing

### Local Testing

To test the service worker locally:

1. Start Hugo development server
2. The service worker will be registered (localhost is allowed)
3. Use Chrome DevTools → Application → Service Workers to debug

### Offline Testing

1. Open Chrome DevTools
2. Go to Application → Service Workers
3. Check "Offline" to simulate offline mode
4. Navigate the site to test offline functionality

### Cache Inspection

1. Open Chrome DevTools
2. Go to Application → Cache Storage
3. Inspect the different caches and their contents

## Browser Support

The service worker supports all modern browsers with service worker capabilities:

- Chrome 40+
- Firefox 44+
- Safari 11.1+
- Edge 16+

### Fallback Behavior

For browsers without service worker support:
- Site continues to work normally
- No offline functionality
- No caching benefits

## Security Considerations

- **HTTPS Required**: Service workers only work on HTTPS (localhost allowed for development)
- **Scope Limitation**: Service worker scope is limited to the origin
- **Cache Security**: Sensitive resources are not cached
- **Integrity Checking**: Hugo's fingerprinting ensures cache integrity

## Performance Impact

### Benefits

- **Reduced Bandwidth**: Cached resources don't need to be re-downloaded
- **Faster Load Times**: Cache-first strategies improve perceived performance
- **Offline Capability**: Site remains functional without internet
- **Better UX**: Smooth transitions between online/offline states

### Considerations

- **Storage Usage**: Caches use browser storage (typically limited to 50MB)
- **Initial Load**: First visit may be slightly slower due to caching
- **Update Frequency**: Need to balance freshness with performance

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Check if using HTTPS or localhost
   - Verify service worker file exists at `/service-worker.js`
   - Check browser console for errors

2. **Content Not Updating**
   - Service worker may be serving cached content
   - Use DevTools to "Update on reload" or "Bypass for network"
   - Increment cache version to force update

3. **Offline Page Not Showing**
   - Verify offline.html exists and is accessible
   - Check if offline page is cached
   - Test with DevTools offline mode

### Debug Tools

Use these browser features for debugging:

- **Chrome DevTools**: Application → Service Workers
- **Firefox DevTools**: Application → Service Workers
- **Safari Web Inspector**: Develop → Service Workers

## Updates and Maintenance

### Version Updates

When updating the service worker:

1. Increment `CACHE_VERSION` in `service-worker.js`
2. Update any caching strategies if needed
3. Test thoroughly in different browsers
4. Deploy and verify update propagation

### Cache Invalidation

To force cache invalidation:

1. Update cache version
2. Clear specific caches via DevTools
3. Use `window.swManager.clearCaches()` for programmatic clearing

## Future Enhancements

Potential improvements for future versions:

- **Web Push Notifications**: Add push notification support
- **Background Sync**: Enhanced background sync capabilities
- **IndexedDB Integration**: For more complex offline data storage
- **Streaming Caching**: For large media files
- **Cache Compression**: Reduce cache storage footprint

## Contributing

When modifying the service worker:

1. Test in multiple browsers
2. Verify offline functionality
3. Check performance impact
4. Update documentation
5. Test cache invalidation

## License

This service worker implementation is part of the Espouse Hugo theme and follows the same license terms.