const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('--- Starting Integration Tests ---');

  try {
    // 1. Test /health
    console.log('\n1. Testing health check endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}`);
    console.log('Body:', healthData);
    if (healthRes.status !== 200 || healthData.status !== 'UP') {
      throw new Error('Health check failed');
    }

    // 2. Ingest events for session A
    console.log('\n2. Sending events for Session A...');
    const eventA1 = {
      session_id: 'session-abc-123',
      event_type: 'page_view',
      page_url: 'http://localhost:3000/home',
      timestamp: new Date(Date.now() - 10000).toISOString() // 10s ago
    };
    const eventA2 = {
      session_id: 'session-abc-123',
      event_type: 'click',
      page_url: 'http://localhost:3000/home',
      timestamp: new Date().toISOString(), // now
      x: 150,
      y: 320
    };

    for (const ev of [eventA1, eventA2]) {
      const res = await fetch(`${BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev)
      });
      const data = await res.json();
      console.log(`POST event status: ${res.status}`);
      if (res.status !== 201) {
        throw new Error(`Failed to ingest event: ${JSON.stringify(data)}`);
      }
    }

    // 3. Ingest event for session B
    console.log('\n3. Sending events for Session B...');
    const eventB1 = {
      session_id: 'session-def-456',
      event_type: 'page_view',
      page_url: 'http://localhost:3000/about',
      timestamp: new Date(Date.now() - 5000).toISOString() // 5s ago
    };

    const resB = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventB1)
    });
    console.log(`POST event status: ${resB.status}`);
    if (resB.status !== 201) {
      throw new Error('Failed to ingest event for Session B');
    }

    // 4. Test GET /api/sessions
    console.log('\n4. Testing GET /api/sessions (Aggregation)...');
    const sessionsRes = await fetch(`${BASE_URL}/api/sessions`);
    const sessionsData = await sessionsRes.json();
    console.log(`Status: ${sessionsRes.status}`);
    console.log('Aggregated Sessions:', JSON.stringify(sessionsData, null, 2));

    if (sessionsRes.status !== 200) {
      throw new Error('Failed to fetch sessions');
    }

    // Verify ordering and structure
    if (!Array.isArray(sessionsData) || sessionsData.length < 2) {
      throw new Error('Aggregation results should contain at least 2 sessions');
    }

    // Since session-abc-123's last event is 'now' and session-def-456's event is '5s ago',
    // session-abc-123 should be first in descending order of last_seen.
    const firstSession = sessionsData[0];
    if (firstSession.session_id !== 'session-abc-123') {
      throw new Error(`Expected first session to be session-abc-123, but got ${firstSession.session_id}`);
    }
    if (firstSession.event_count !== 2) {
      throw new Error(`Expected session-abc-123 to have 2 events, got ${firstSession.event_count}`);
    }

    console.log('\n--- All Integration Tests Passed Successfully! ---');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

runTests();
