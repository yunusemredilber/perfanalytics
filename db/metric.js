const mongoose = require('mongoose');

const metricScheme = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  user_agent: {
    type: String,
    required: true
  },
  dom_load: {
    type: Number,
    required: true
  },
  fcp: {
    type: Number,
    required: true
  },
  ttfb: {
    type: Number,
    required: true
  },
  window_load: {
    type: Number,
    required: true
  },
  files: [{
    name: {
      type: String,
      required: true
    },
    file_type: {
      type: String,
      required: true
    },
    responseEnd: {
      type: Number,
      required: true
    }
  }],
  navigation_started_at: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Metric', metricScheme)
