const Event = require('../models/Event');

const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          event_count: { $sum: 1 },
          first_seen: { $min: '$timestamp' },
          last_seen: { $max: '$timestamp' },
        },
      },
      {
        $project: {
          _id: 0,
          session_id: '$_id',
          event_count: 1,
          first_seen: 1,
          last_seen: 1,
        },
      },
      { $sort: { last_seen: -1 } },
    ]);

    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSessionEvents = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ session_id: sessionId })
      .sort({ timestamp: 1 })
      .select('-_id event_type page_url timestamp x y');

    if (events.length === 0) {
      return res.status(404).json({ error: 'No events found for this session' });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching session events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSessions, getSessionEvents };
