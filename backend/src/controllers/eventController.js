const Event = require('../models/Event');

// POST /api/events
exports.trackEvent = async (req, res) => {
  try {
    const payload = req.body;

    // Support single event or batch events
    if (Array.isArray(payload)) {
      if (payload.length === 0) {
        return res.status(400).json({ success: false, error: 'Empty batch payload' });
      }

      // Basic validation for each item in the batch
      for (const item of payload) {
        if (!item.eventType || !item.sessionId || !item.url || !item.userAgent) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields on one or more items (eventType, sessionId, url, userAgent)' 
          });
        }
      }

      const events = await Event.insertMany(payload);
      return res.status(201).json({ success: true, count: events.length });
    } else {
      const { eventType, eventName, sessionId, userId, url, referrer, userAgent, properties, timestamp } = payload;

      // Validation
      if (!eventType || !sessionId || !url || !userAgent) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields (eventType, sessionId, url, userAgent)' 
        });
      }

      const newEvent = new Event({
        eventType,
        eventName,
        sessionId,
        userId,
        url,
        referrer,
        userAgent,
        properties,
        timestamp
      });

      const savedEvent = await newEvent.save();
      return res.status(201).json({ success: true, data: savedEvent });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// GET /api/events (for debugging/development)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 }).limit(100);
    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
