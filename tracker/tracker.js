(function () {
  'use strict';

  // Constants
  const SESSION_KEY = 'cf_session_id';
  const USER_KEY = 'cf_user_id';
  const DEFAULT_ENDPOINT = 'http://localhost:5001/api/events';

  // State
  let config = {
    endpoint: DEFAULT_ENDPOINT,
    autoTrackPageviews: true,
    autoTrackClicks: true,
  };

  // Helper to generate UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Get or create Session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  // Get User ID if set
  function getUserId() {
    return localStorage.getItem(USER_KEY) || null;
  }

  // Build the common payload
  function buildPayload(eventType, eventName, properties = {}) {
    return {
      eventType: eventType,
      eventName: eventName || eventType,
      sessionId: getSessionId(),
      userId: getUserId(),
      url: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      properties: {
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language || navigator.userLanguage || '',
        title: document.title || '',
        ...properties
      },
      timestamp: new Date().toISOString()
    };
  }

  // Send request
  function sendEvent(payload) {
    const data = JSON.stringify(payload);
    
    // Attempt sendBeacon first for non-blocking transport
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([data], { type: 'application/json' });
        const success = navigator.sendBeacon(config.endpoint, blob);
        if (success) return;
      } catch (e) {
        console.warn('sendBeacon failed, falling back to fetch', e);
      }
    }

    // Fallback to fetch
    fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
      mode: 'cors',
      keepalive: true
    }).catch(error => {
      console.error('Error sending analytics event:', error);
    });
  }

  // Core API
  const causalfunnel = {
    init: function (options = {}) {
      config = { ...config, ...options };

      if (config.autoTrackPageviews) {
        this.trackPageview();
      }

      if (config.autoTrackClicks) {
        this.setupClickTracking();
      }
    },

    identify: function (userId) {
      if (userId) {
        localStorage.setItem(USER_KEY, userId);
      } else {
        localStorage.removeItem(USER_KEY);
      }
    },

    track: function (eventName, properties = {}) {
      const payload = buildPayload('custom', eventName, properties);
      sendEvent(payload);
    },

    trackPageview: function (properties = {}) {
      const payload = buildPayload('pageview', 'page_view', properties);
      sendEvent(payload);
    },

    setupClickTracking: function () {
      document.addEventListener('click', (event) => {
        let target = event.target;
        if (!target) return;
        
        // Find closest element with data-cf-event attribute or a standard button/link
        const trackableElement = target.closest('[data-cf-event]') || target.closest('button') || target.closest('a');
        
        if (trackableElement) {
          const eventName = trackableElement.getAttribute('data-cf-event') || 
                            (trackableElement.tagName === 'A' ? 'link_click' : 'button_click');
          
          const properties = {
            elementId: trackableElement.id || '',
            elementClass: trackableElement.className || '',
            elementText: (trackableElement.innerText || trackableElement.value || '').substring(0, 50).trim(),
            elementTag: trackableElement.tagName.toLowerCase()
          };

          if (trackableElement.tagName === 'A') {
            properties.href = trackableElement.getAttribute('href') || '';
          }

          // If they specified custom data attributes like data-cf-prop-name="value", collect them
          for (let i = 0; i < trackableElement.attributes.length; i++) {
            const attr = trackableElement.attributes[i];
            if (attr.name.startsWith('data-cf-prop-')) {
              const propName = attr.name.slice(13).replace(/-([a-z])/g, g => g[1].toUpperCase());
              properties[propName] = attr.value;
            }
          }

          this.track(eventName, properties);
        }
      }, true); // Use capture phase to handle clicks reliably
    }
  };

  // Expose to window
  window.causalfunnel = causalfunnel;

  // Auto initialize on load/DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    causalfunnel.init();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      causalfunnel.init();
    });
  }
})();
