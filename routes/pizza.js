const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send(`Margharita\nAmericana\nFunghi`);
  });
  
  module.exports = router;