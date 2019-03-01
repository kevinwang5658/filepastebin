const express = require('express');
const router = express.Router();

const DEV = true;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(process.env.DEBUG);
  res.render('index', { dev: DEV && process.env.DEBUG });
});

module.exports = router;

export {};
