/**
 * Created by manager on 2016-07-14.
 */
var request = require('request');

exports.getBaseUrl = function (ip, port) {
    var url = 'http://' + ip + ':' + port;
    return url;
}

exports.getVHostsName = function(baseUrl) {
    var url = baseUrl + "/v2/servers/_defaultServer_/vhosts";
    var requestOption = {
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
            console.log(vhosts);
            vhostsName = vhosts.vhosts.map( (v, i) => {
                return v.id;
            });
            resolve(vhostsName);
        });
    });
};

exports.getVhostAdminPort = function (baseUrl, vhostName) {
    var url = baseUrl + "/v2/servers/_defaultServer_/vhosts/" + vhostName;
    var requestOption = {
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
            console.log(vhostsConfig);
            vhostsConfig.HostPorts.forEach( (v, i) => {
                if( v.type === 'Admin' )
                    return resolve(v.port);
            });
        });
    });
}

var baseUrl = this.getBaseUrl('localhost', 8087);
this.getVHostsName( baseUrl )
    .then( vhostsName => {
        vhostAdminPortPromises = vhostsName.map( (v, i) => {
            return this.getVhostAdminPort(baseUrl, v);
        });

    });