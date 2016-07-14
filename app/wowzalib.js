/**
 * Created by manager on 2016-07-14.
 */
var request = require('request');
var item = require('../item');

function getFuncName(caller) {
    var f = arguments.callee.caller;
    if(caller) f = f.caller;
    var pat = /^function\s+([a-zA-Z0-9_]+)\s*\(/i;
    pat.exec(f);
    return RegExp.$1;
}

function requestGetRestApi(url, reqJsonProcessor) {
    var callerFuncName = getFuncName(true);
    var requestOption = {
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        }
    };
    console.log(callerFuncName);

    return new Promise( (resolve, reject) => {
        request(requestOption, (err, res, body) => {
            if (err) {
                reject(err);
                return console.error(callerFuncName +' throw err');
            }
            if (res.statusCode != 200) {
                reject(callerFuncName + ' statusCode is not 200');
                return console.error(callerFuncName +' statusCode : ' + res.statusCode);
            }

            var resJson = JSON.parse(body);
            reqJsonProcessor(resJson, resolve, reject);
        });
    });
}

exports.getBaseUrl = function getBaseUrl(ip, port) {
    var url = 'http://' + ip + ':' + port;
    return url;
}

exports.getVHostsName = function getVHostsName(baseUrl) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        // console.log(vhosts);
        vhostsName = resJson.vhosts.map( (vhost, i) => {
            return vhost.id;
        });
        resolve(vhostsName);
    });

    /*var requestOption = {
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        }
    };

    return new Promise( (resolve, reject) => {
        request(requestOption, (err, res, body) => {
            if (err) {
                reject(err);
                return console.error(err);
            }
            if (res.statusCode != 200) {
                reject('getVHosts statusCode : ' + res.statusCode);
                return console.error('getVHosts statusCode : ' + res.statusCode);
            }

            var vhosts = JSON.parse(body);
            // console.log(vhosts);
            vhostsName = vhosts.vhosts.map( (v, i) => {
                return v.id;
            });
            resolve(vhostsName);
        });
    });*/
};

exports.getVhostAdminPort = function getVhostAdminPort(baseUrl, vhostName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName;

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        // console.log(vhostsConfig);
        resJson.HostPorts.forEach( (v, i) => {
            if( v.type === 'Admin' )
                return resolve(v.port);
        });
    });


    /*var requestOption = {
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        }
    };

    return new Promise( (resolve, reject) => {
        request(requestOption, (err, res, body) => {
            if (err) {
                reject(err);
                return console.error(err);
            }
            if (res.statusCode != 200) {
                reject('getVhostAdminPort statusCode : ' + res.statusCode);
                return console.error('getVhostAdminPort statusCode : ' + res.statusCode);
            }

            var vhostsConfig = JSON.parse(body);
            // console.log(vhostsConfig);
            vhostsConfig.HostPorts.forEach( (v, i) => {
                if( v.type === 'Admin' )
                    return resolve(v.port);
            });
        });
    });*/
};

exports.getApplications = function getApplications(baseUrl, vhostName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName + '/applications';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var jsonApplications = resJson.applications;
        var Applications = jsonApplications.map((application, i) => {
            return new item.application( application.id, application.appType );
        });

        resolve(Applications);
    });
};

exports.getIncomingStreams = function getIncomingStreams(baseUrl, vhostName, appName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName + '/applications/' + appName + '/instances';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var jsonApplications = resJson.applications;
        var Applications = jsonApplications.map((application, i) => {
            return new item.application( application.id, application.appType );
        });

        resolve(Applications);
    });
};

var vhosts = [];
var baseUrl = this.getBaseUrl('localhost', 8087);
this.getVHostsName( baseUrl )
    .then( vhostsName => {
        var vhostAdminPortPromises = vhostsName.map( (vhostName, i) => {
            vhosts.push( new item.vhost(vhostName) );
            return this.getVhostAdminPort(baseUrl, vhostName);
        });

        return Promise.all(vhostAdminPortPromises);
    })
    .then( vhostAdminPorts => {
        var applicationsPromises = vhosts.map((vhost, i) => {
            vhost.vhostAdminPort = vhostAdminPorts[i];
            return this.getApplications(baseUrl, vhost.vhostName);
        });

        return Promise.all(applicationsPromises);
    })
    .then( applications => {
        vhosts.forEach( (vhost, i) => {
            vhost.applications = applications[i];
            console.log(vhost.applications);
        });
        console.log(vhosts);
    });
