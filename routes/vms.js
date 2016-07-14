var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/vms', function(req, res, next) {
  res.render('vms', { title: 'Express' });
});

module.exports = router;
