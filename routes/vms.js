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
            handleError(res, err);
        })
});

router.get('/:vhostName/:appName/streamfiles', (req, res, next) => {
    let vhostName = req.params.vhostName;
    let appName = req.params.appName;

    wowzaManagerLib.getStreamFiles(baseUrl, vhostName, appName)
        .then( streamFiles => {
            res.json(streamFiles);
        })
        .catch( err => {
            handleError(res, err);
        })
});

router.post('/:vhostName/:appName/streamfiles', (req, res, next) => {
    let vhostName = req.params.vhostName;
    let appName = req.params.appName;
    let body = req.body;

    wowzaManagerLib.createStreamFile(baseUrl, vhostName, appName, body.name, body.uri)
        .then( statusCode => {
            res.status(statusCode).end();
        })
        .catch( err => {
            handleError(res, err);
        })
});

router.put('/:vhostName/:appName/streamfiles/:streamFileName', (req, res, next) => {
    let vhostName = req.params.vhostName;
    let appName = req.params.appName;
    let steramFileName = req.params.streamFileName;
    let streamUri = req.body;

    console.log(req);
    console.log(res);

    wowzaManagerLib.modifyStreamFile(baseUrl, vhostName, appName, steramFileName, streamUri)
        .then( statusCode => {
            res.status(statusCode).end();
        })
        .catch( err => {
            handleError(res, err);
        });
});

router.delete('/:vhostName/:appName/streamfiles/:streamFileName', (req, res, next) => {
    let vhostName = req.params.vhostName;
    let appName = req.params.appName;
    let steramFileName = req.params.streamFileName;

    wowzaManagerLib.deleteStreamFile(baseUrl, vhostName, appName, steramFileName)
        .then( statusCode => {
            res.status(statusCode).end();
        })
        .catch( err => {
            handleError(res, err);
        });
});

function handleError(res, err) {
    console.log(err);
    res.status(500).end();
}

module.exports = router;
