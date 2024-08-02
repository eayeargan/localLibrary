const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('H3110 W0R1D');
});

module.exports = router;
