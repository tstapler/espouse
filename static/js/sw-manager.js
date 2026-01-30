/**
 * Service Worker Registration and Management
 * 
 * This module handles service worker registration, updates, and user notifications.
 * It integrates seamlessly with Hugo's build system and supports dark mode preservation.
 */

(function() {
  'use strict';

  // Configuration
  const SW_VERSION = '1.0.0';
  const SW_URL = '/service-worker.js';
  
  // Service Worker state
  let swRegistration = null;
  let isOnline = navigator.onLine;
  let updateAvailable = false;
  
  // Dark mode preservation
  const DARK_MODE_KEY = 'darkMode';
  
  /**
   * Check if service workers are supported
   */
  function isServiceWorkerSupported() {
    return 'serviceWorker' in navigator && 
           'caches' in window && 
           'fetch' in window;
  }
  
  /**
   * Register the service worker
   */
  async function registerServiceWorker() {
    if (!isServiceWorkerSupported()) {
      console.warn('[SW Manager] Service workers are not supported in this browser');
      return false;
    }
    
    try {
      swRegistration = await navigator.serviceWorker.register(SW_URL, {
        scope: '/'
      });
      
      console.log('[SW Manager] Service worker registered successfully:', swRegistration.scope);
      
      // Handle updates
      swRegistration.addEventListener('updatefound', handleUpdateFound);
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      
      // Listen for connection changes
      window.addEventListener('online', () => handleConnectionChange(true));
      window.addEventListener('offline', () => handleConnectionChange(false));
      
      // Check for existing updates
      if (swRegistration.waiting) {
        handleUpdateAvailable();
      }
      
      return true;
    } catch (error) {
      console.error('[SW Manager] Service worker registration failed:', error);
      return false;
    }
  }
  
  /**
   * Handle service worker update found
   */
  function handleUpdateFound() {
    const installingWorker = swRegistration.installing;
    
    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New service worker is available, show update notification
        handleUpdateAvailable();
      } else if (installingWorker.state === 'activated') {
        // New service worker is activated
        updateAvailable = false;
        hideUpdateNotification();
        console.log('[SW Manager] Service worker activated');
      }
    });
  }
  
  /**
   * Handle update available
   */
  function handleUpdateAvailable() {
    updateAvailable = true;
    showUpdateNotification();
  }
  
  /**
   * Show update notification to user
   */
  function showUpdateNotification() {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('sw-update-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'sw-update-notification';
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2185d0;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 300px;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
      `;
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <strong>🚀 New Version Available</strong>
          <button onclick="window.swManager.hideUpdateNotification()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
        </div>
        <p style="margin: 0 0 10px 0;">A new version of the site is available with updates and improvements.</p>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.swManager.applyUpdate()" style="background: white; color: #2185d0; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: 500;">Update Now</button>
          <button onclick="window.swManager.skipUpdate()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Later</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
      }, 100);
    }
  }
  
  /**
   * Hide update notification
   */
  function hideUpdateNotification() {
    const notification = document.getElementById('sw-update-notification');
    if (notification) {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }
  
  /**
   * Apply the update
   */
  function applyUpdate() {
    if (swRegistration && swRegistration.waiting) {
      // Tell the waiting service worker to skip waiting
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Save dark mode preference before reload
      localStorage.setItem(DARK_MODE_KEY, document.body.classList.contains('dark') || 
                         localStorage.getItem(DARK_MODE_KEY));
      
      // Page will be reloaded by the service worker activation
      console.log('[SW Manager] Update applied, reloading...');
    }
  }
  
  /**
   * Skip the update for now
   */
  function skipUpdate() {
    hideUpdateNotification();
    console.log('[SW Manager] Update skipped by user');
  }
  
  /**
   * Handle messages from service worker
   */
  function handleSWMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'SW_UPDATED':
        console.log('[SW Manager] Service worker updated:', data.version);
        // Reload the page to get the latest version
        window.location.reload();
        break;
        
      default:
        console.log('[SW Manager] Unknown message type:', type);
    }
  }
  
  /**
   * Handle connection changes
   */
  function handleConnectionChange(online) {
    isOnline = online;
    
    // Update any connection indicators
    updateConnectionIndicator();
    
    // Notify service worker about connection status
    if (swRegistration && swRegistration.active) {
      swRegistration.active.postMessage({
        type: 'CONNECTION_CHANGE',
        data: { online }
      });
    }
  }
  
  /**
   * Update connection indicator if it exists
   */
  function updateConnectionIndicator() {
    const indicator = document.getElementById('connection-indicator');
    if (indicator) {
      indicator.className = isOnline ? 'online' : 'offline';
      indicator.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
    }
  }
  
  /**
   * Get service worker version
   */
  async function getServiceWorkerVersion() {
    if (!swRegistration) {
      return null;
    }
    
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version);
      };
      
      swRegistration.active?.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
      
      // Fallback timeout
      setTimeout(() => resolve(SW_VERSION), 1000);
    });
  }
  
  /**
   * Clear all caches
   */
  async function clearCaches() {
    if (!swRegistration) {
      return false;
    }
    
    try {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success);
        };
        
        swRegistration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
        
        setTimeout(() => resolve(false), 5000);
      });
    } catch (error) {
      console.error('[SW Manager] Failed to clear caches:', error);
      return false;
    }
  }
  
  /**
   * Preload important pages for offline use
   */
  function preloadOfflineContent() {
    if (!swRegistration) {
      return;
    }
    
    const importantPages = ['/articles/', '/photography/', '/'];
    
    swRegistration.active?.postMessage({
      type: 'PREFETCH_PAGES',
      data: { pages: importantPages }
    });
  }
  
  /**
   * Initialize service worker when DOM is ready
   */
  function init() {
    // Only register service worker for production or when explicitly enabled
    const isProduction = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    const swEnabled = localStorage.getItem('serviceWorkerEnabled') !== 'false';
    
    if (isProduction || swEnabled) {
      registerServiceWorker();
    }
    
    // Restore dark mode from localStorage (preserved across service worker updates)
    const darkMode = localStorage.getItem(DARK_MODE_KEY);
    if (darkMode === 'true' && !document.body.classList.contains('dark')) {
      // Apply dark mode after a short delay to ensure other scripts have loaded
      setTimeout(() => {
        document.body.classList.add('dark');
      }, 100);
    }
    
    // Add connection indicator (optional)
    addConnectionIndicator();
  }
  
  /**
   * Add connection indicator to page
   */
  function addConnectionIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'connection-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 1000;
      display: none;
    `;
    indicator.className = isOnline ? 'online' : 'offline';
    indicator.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
    
    // Only show in development or when debug mode is enabled
    if (location.hostname === 'localhost' || localStorage.getItem('debugMode') === 'true') {
      indicator.style.display = 'block';
      document.body.appendChild(indicator);
    }
  }
  
  // Expose public API
  window.swManager = {
    // Methods
    register: registerServiceWorker,
    update: applyUpdate,
    skipUpdate: skipUpdate,
    clearCaches: clearCaches,
    preload: preloadOfflineContent,
    getVersion: getServiceWorkerVersion,
    hideUpdateNotification: hideUpdateNotification,
    
    // Properties
    isSupported: isServiceWorkerSupported(),
    isOnline: () => isOnline,
    isUpdateAvailable: () => updateAvailable,
    version: SW_VERSION
  };
  
  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Log that service worker manager is loaded
  console.log('[SW Manager] Service worker manager loaded v' + SW_VERSION);
  
})();