const mongoose = require('mongoose');

const metricScheme = new mongoose.Schema({
  dom_load: Number,
  fcp: Number,
  ttfb: Number,
  window_load: Number,
  files: [{
    name: String,
    file_type: String,
    responseEnd: Number
  }]
});

module.exports = mongoose.model('Metric', metricScheme)
