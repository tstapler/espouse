/**
 * Service Worker Test Suite
 * 
 * This script provides automated testing for the service worker implementation.
 * Run this in the browser console to verify functionality.
 */

(function() {
  'use strict';
  
  const ServiceWorkerTester = {
    
    /**
     * Run all tests
     */
    async runAllTests() {
      console.log('🧪 Starting Service Worker Tests...\n');
      
      const results = {
        registration: await this.testRegistration(),
        caching: await this.testCaching(),
        offline: await this.testOfflineFunctionality(),
        updates: await this.testUpdateMechanism(),
        cleanup: await this.testCacheCleanup()
      };
      
      this.printResults(results);
      return results;
    },
    
    /**
     * Test service worker registration
     */
    async testRegistration() {
      console.log('📋 Testing Service Worker Registration...');
      
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (!registration) {
          return { success: false, error: 'No service worker registration found' };
        }
        
        const sw = registration.active || registration.installing || registration.waiting;
        
        return {
          success: true,
          data: {
            scope: registration.scope,
            state: sw?.state,
            url: sw?.scriptURL
          }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    /**
     * Test caching functionality
     */
    async testCaching() {
      console.log('💾 Testing Caching Functionality...');
      
      const testUrls = [
        '/',
        '/all.css',
        '/js/all.bundle.js',
        '/manifest.json'
      ];
      
      const results = [];
      
      for (const url of testUrls) {
        try {
          const response = await fetch(url);
          const cached = response.fromCache || false;
          
          results.push({
            url,
            status: response.status,
            cached,
            success: response.ok
          });
        } catch (error) {
          results.push({
            url,
            error: error.message,
            success: false
          });
        }
      }
      
      return {
        success: results.every(r => r.success),
        data: results
      };
    },
    
    /**
     * Test offline functionality
     */
    async testOfflineFunctionality() {
      console.log('📡 Testing Offline Functionality...');
      
      // Test offline page
      try {
        const response = await fetch('/offline.html');
        const offlinePageExists = response.ok;
        
        // Test dark mode preservation
        const darkModePreserved = localStorage.getItem('darkMode') !== null;
        
        return {
          success: offlinePageExists,
          data: {
            offlinePageExists,
            darkModePreserved,
            offlinePageStatus: response.status
          }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    /**
     * Test update mechanism
     */
    async testUpdateMechanism() {
      console.log('🔄 Testing Update Mechanism...');
      
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (!registration) {
          return { success: false, error: 'No registration found' };
        }
        
        // Check if update method exists
        const hasUpdateMethod = typeof registration.update === 'function';
        
        // Check for waiting service worker
        const hasWaitingWorker = registration.waiting !== null;
        
        return {
          success: hasUpdateMethod,
          data: {
            hasUpdateMethod,
            hasWaitingWorker,
            canUpdate: true
          }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    /**
     * Test cache cleanup
     */
    async testCacheCleanup() {
      console.log('🧹 Testing Cache Cleanup...');
      
      try {
        const cacheNames = await caches.keys();
        const hasVersionedCaches = cacheNames.some(name => name.includes('v1.0.0'));
        
        return {
          success: hasVersionedCaches,
          data: {
            cacheNames,
            cacheCount: cacheNames.length,
            hasVersionedCaches
          }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    /**
     * Print test results
     */
    printResults(results) {
      console.log('\n📊 Test Results:');
      console.log('================');
      
      Object.entries(results).forEach(([test, result]) => {
        const status = result.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.toUpperCase()}`);
        
        if (!result.success && result.error) {
          console.log(`   Error: ${result.error}`);
        }
        
        if (result.data) {
          console.log('   Details:', result.data);
        }
      });
      
      const allPassed = Object.values(results).every(r => r.success);
      console.log('\n' + (allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'));
    },
    
    /**
     * Test specific URL caching behavior
     */
    async testUrlCaching(url) {
      console.log(`🔍 Testing caching for: ${url}`);
      
      try {
        // First request (should be from network)
        const start1 = performance.now();
        const response1 = await fetch(url);
        const time1 = performance.now() - start1;
        
        // Second request (should be from cache if applicable)
        const start2 = performance.now();
        const response2 = await fetch(url);
        const time2 = performance.now() - start2;
        
        return {
          url,
          firstRequest: {
            status: response1.status,
            time: time1,
            cached: false
          },
          secondRequest: {
            status: response2.status,
            time: time2,
            cached: time2 < time1 // Heuristic: cache should be faster
          },
          speedImprovement: time1 > 0 ? ((time1 - time2) / time1 * 100).toFixed(1) + '%' : 'N/A'
        };
      } catch (error) {
        return { url, error: error.message };
      }
    },
    
    /**
     * Simulate offline mode
     */
    async simulateOffline() {
      console.log('📡 Simulating offline mode...');
      
      // Go offline
      const offline = await new Promise(resolve => {
        const goOffline = () => {
          window.dispatchEvent(new Event('offline'));
          resolve(true);
        };
        
        if (navigator.onLine) {
          // Simulate going offline
          Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: false
          });
          goOffline();
        } else {
          resolve(false);
        }
      });
      
      return { offline };
    },
    
    /**
     * Get cache statistics
     */
    async getCacheStats() {
      console.log('📈 Getting Cache Statistics...');
      
      try {
        const cacheNames = await caches.keys();
        const stats = {};
        
        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          stats[name] = {
            count: keys.length,
            urls: keys.map(request => request.url)
          };
        }
        
        return {
          success: true,
          data: stats
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
  
  // Expose to global scope
  window.ServiceWorkerTester = ServiceWorkerTester;
  
  // Auto-run if URL contains test parameter
  if (location.search.includes('sw-test')) {
    ServiceWorkerTester.runAllTests();
  }
  
  console.log('🧪 Service Worker Tester loaded. Use ServiceWorkerTester.runAllTests() to start testing.');
  
})();