const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    index: true,
  },
  event_type: {
    type: String,
    required: true,
    enum: ['page_view', 'click'],
  },
  page_url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  x: {
    type: Number,
  },
  y: {
    type: Number,
  },
}, {
  timestamps: { createdAt: 'received_at', updatedAt: false },
});

eventSchema.index({ page_url: 1, event_type: 1 });

module.exports = mongoose.model('Event', eventSchema);
