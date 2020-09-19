var express = require('express');
var Metric = require('../db/metric')
var router = express.Router();

router.get('/', function(req, res, next) {
  Metric.find().then((metrics) => {
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
