var express = require('express');
var router = express.Router();
var wowzalib = require('../app/wowzalib');

var wowzaIp = process.argv[3];
var wowzaRestApiPort = process.argv[4];

router.get('/', function(req, res, next) {
    var vhosts = [];
    var baseUrl = wowzalib.getBaseUrl('localhost', 8087);
    wowzalib.addVHosts(baseUrl, vhosts).then( () => {
        res.render('vms', { vhosts: wowzalib.getJstreeData(vhosts) });
    });
});

router.get('/vhost-tree-nodes', function(req, res, next) {
    wowzalib.getVhostsObj(wowzaIp, wowzaRestApiPort)
        .then( vhosts => {
            console.log(vhosts);
            res.json( wowzalib.getJstreeData(vhosts) );
        })
        .catch( err => {
            console.error(err);
            res.status(500).end();
        });
});

module.exports = router;
