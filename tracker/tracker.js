(function () {
  const API_URL = '/api/events';

  function getSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  function getPageUrl() {
    return window.location.origin + window.location.pathname;
  }

  function sendEvent(eventData) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    }).catch((error) => {
      console.error('Tracking error:', error);
    });
  }

  function trackPageView() {
    sendEvent({
      session_id: getSessionId(),
      event_type: 'page_view',
      page_url: getPageUrl(),
      timestamp: new Date().toISOString(),
    });
  }

  function trackClick(event) {
    sendEvent({
      session_id: getSessionId(),
      event_type: 'click',
      page_url: getPageUrl(),
      timestamp: new Date().toISOString(),
      x: event.clientX,
      y: event.clientY,
    });
  }

  trackPageView();
  document.addEventListener('click', trackClick);
})();
