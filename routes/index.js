var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: { test1 : 'abc', test2 : 'cba' } });
});

module.exports = router;
