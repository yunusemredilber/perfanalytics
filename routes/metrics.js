const express = require('express');
const Metric = require('../db/metric');
const router = express.Router();

router.get('/', function(req, res, next) {
  const timeRangeMin = () => {
    if(req.query.min) {
      return new Date(req.query.min).toString()
    }

    const date = new Date()
    return date.setMinutes(date.getMinutes() - 30).toString()
  }
  const timeRangeMax = () => {
    if(req.query.max) {
      return new Date(req.query.max).toString()
    }

    return new Date().toString()
  }
  Metric
    .find({ navigation_started_at: { $gte: timeRangeMin(), $lte: timeRangeMax() } })
    .sort({ navigation_started_at: 1 })
    .then((metrics) => {
    res.json(metrics);
  }).catch((err) => {
    res.status(500);
    res.json(err);
  });
});

router.post("/", function(req, res, next){
  new Metric(req.body).save().then(metric => {
    res.json({
      message: 'Metric saved',
      data: metric
    });
  }).catch((err) => {
    res.status(500);
    res.json({
      message: 'Metric saving error',
      error: err
    });
  });
});

module.exports = router;
