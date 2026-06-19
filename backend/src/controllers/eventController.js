const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    if (!session_id || !event_type || !page_url || !timestamp) {
      return res.status(400).json({
        error: 'session_id, event_type, page_url, and timestamp are required',
      });
    }

    const event = await Event.create({
      session_id,
      event_type,
      page_url,
      timestamp,
      x,
      y,
    });

    res.status(201).json(event);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHeatmapData = async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({ error: 'page_url is required' });
    }

    const clicks = await Event.find({ page_url, event_type: 'click' })
      .select('-_id x y');

    res.status(200).json(clicks);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPages = async (req, res) => {
  try {
    const pages = await Event.distinct('page_url');
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createEvent, getHeatmapData, getPages };
