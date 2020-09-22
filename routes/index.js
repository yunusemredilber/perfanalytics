const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // Only for the production
  res.redirect('/dashboard');
});

module.exports = router;
