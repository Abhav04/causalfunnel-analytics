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

    // 2. Test POST /api/events (Single Event)
    console.log('\n2. Testing POST /api/events (Single Event)...');
    const singlePayload = {
      eventType: 'pageview',
      eventName: 'page_view',
      sessionId: 'test-session-123',
      userId: 'user-999',
      url: 'http://localhost/test',
      referrer: 'http://google.com',
      userAgent: 'Mozilla/5.0 NodeTestClient',
      properties: {
        pageTitle: 'Test Page',
        loadTimeMs: 150
      }
    };

    const postSingleRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(singlePayload)
    });
    const postSingleData = await postSingleRes.json();
    console.log(`Status: ${postSingleRes.status}`);
    console.log('Body:', postSingleData);
    if (postSingleRes.status !== 201 || !postSingleData.success) {
      throw new Error('Single event ingestion failed');
    }

    // 3. Test POST /api/events (Batch Events)
    console.log('\n3. Testing POST /api/events (Batch Events)...');
    const batchPayload = [
      {
        eventType: 'click',
        eventName: 'button_click',
        sessionId: 'test-session-123',
        url: 'http://localhost/test',
        userAgent: 'Mozilla/5.0 NodeTestClient',
        properties: { buttonId: 'submit-btn' }
      },
      {
        eventType: 'custom',
        eventName: 'purchase',
        sessionId: 'test-session-123',
        url: 'http://localhost/test',
        userAgent: 'Mozilla/5.0 NodeTestClient',
        properties: { amount: 99.99, currency: 'USD' }
      }
    ];

    const postBatchRes = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchPayload)
    });
    const postBatchData = await postBatchRes.json();
    console.log(`Status: ${postBatchRes.status}`);
    console.log('Body:', postBatchData);
    if (postBatchRes.status !== 201 || !postBatchData.success) {
      throw new Error('Batch event ingestion failed');
    }

    // 4. Test GET /api/events (Verify Retrieval)
    console.log('\n4. Testing GET /api/events (Verify Retrieval)...');
    const getRes = await fetch(`${BASE_URL}/api/events`);
    const getData = await getRes.json();
    console.log(`Status: ${getRes.status}`);
    console.log(`Total events fetched: ${getData.count}`);
    if (getRes.status !== 200 || !getData.success || getData.count < 3) {
      throw new Error('Retrieval verification failed');
    }

    console.log('\n--- All Tests Passed Successfully! ---');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

runTests();
