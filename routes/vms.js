var express = require('express');
var router = express.Router();
var wowzaLib = require('../app/wowza-lib');
var wowzaManagerLib = require('../app/wowza-manager-lib');

var wowzaIp = process.argv[3];
var wowzaRestApiPort = process.argv[4];
var baseUrl = wowzaLib.getBaseUrl(wowzaIp, wowzaRestApiPort);

router.get('/', (req, res, next) => {
    res.sendfile('public/ng-vms.html');
});

router.get('/vhost-tree-nodes', (req, res, next) => {
    wowzaLib.getVhostsObj(wowzaIp, wowzaRestApiPort)
        .then( vhosts => {
            console.log(vhosts);
            res.json( wowzaLib.getJstreeData(vhosts) );
        })
        .catch( err => {
            console.error(err);
            res.status(500).end();
        });
});

router.get('/:vhostName/:appName/streamfiles', (req, res, next) => {
    var vhostName = req.params.vhostName;
    var appName = req.params.appName;

    wowzaManagerLib.getStreamFiles(baseUrl, vhostName, appName)
        .then( streamFiles => {
            res.json(streamFiles);
        })
        .catch( err => {
            console.error(err);
            res.status(500).end();
        });
});

module.exports = router;
