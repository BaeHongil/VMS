var express = require('express');
var router = express.Router();
var wowzalib = require('../app/wowzalib');

router.get('/', function(req, res, next) {
    var vhosts = [];
    var baseUrl = wowzalib.getBaseUrl('localhost', 8087);
    wowzalib.addVHostsName(baseUrl, vhosts).then( () => {
        res.render('vms', { vhosts: wowzalib.getJstreeData(vhosts) });
    });
});


module.exports = router;
