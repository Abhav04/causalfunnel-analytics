const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const heatmapRoutes = require('./routes/heatmapRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static tracker files
app.use(express.static(path.join(__dirname, '../../tracker')));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/heatmap', heatmapRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Fallback route for 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

module.exports = app;
