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
    // console.log(callerFuncName);

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
};

exports.addVHostsName = function addVHostsName(baseUrl, vhosts) {
    return exports.getVHostsName(baseUrl)
        .then(vhostsName => {
            var addVhostPortsPromises = vhostsName.map( (vhostName, i) => {
                vhost = new item.vhost(vhostName);
                vhosts.push(vhost);
                return exports.addVhostPorts(baseUrl, vhost);
            });

            return Promise.all(addVhostPortsPromises);
        });
};

exports.getVhostPorts = function getVhostPorts(baseUrl, vhostName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName;

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var ports = {};
        resJson.HostPorts.forEach( (resJsonHostPort, i) => {
            if( resJsonHostPort.type === 'Admin' )
                ports.vhostAdminPort = resJsonHostPort.port;
            else if( resJsonHostPort.type === 'Streaming' )
                ports.vhostStreamingPort = resJsonHostPort.port;
        });

        return resolve(ports);
    });
};

exports.addVhostPorts = function addVhostPorts(baseUrl, vhost) {
    return exports.getVhostPorts(baseUrl, vhost.vhostName)
        .then( vhostPorts => {
            vhost.vhostAdminPort = vhostPorts.vhostAdminPort;
            vhost.vhostStreamingPort = vhostPorts.vhostStreamingPort;
            return exports.addApplications(baseUrl, vhost);
        } );
};

exports.getApplications = function getApplications(baseUrl, vhostName, isOnlyLive) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName + '/applications';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var jsonApplications = resJson.applications;
        var applications = [];
        jsonApplications.forEach((application, i) => {
            if( !isOnlyLive || application.appType === 'Live' )
                applications.push( new item.application(application.id, application.appType) );
        });

        resolve(applications);
    });
};

exports.addApplications = function addApplications(baseUrl, vhost) {
    return exports.getApplications(baseUrl, vhost.vhostName, true)
        .then( applications => {
            var addIncomingStreamsPromises = applications.map( (application, i) => {
                vhost.applications.push( application );
                return exports.addIncomingStreams(baseUrl, vhost.vhostName, application);
            });

            return Promise.all(addIncomingStreamsPromises);
        } );
};

exports.getIncomingStreams = function getIncomingStreams(baseUrl, vhostName, appName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/' + vhostName + '/applications/' + appName + '/instances';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var jsonInstanceList = resJson.instanceList;
        var incomingStreams = jsonInstanceList.map( (jsonInstance, i) => {
            var stream;
            jsonInstance.incomingStreams.forEach( (jsonIncomingStream, i) => {
                stream = new item.stream( jsonIncomingStream.applicationInstance, jsonIncomingStream.name );
            });
            return stream;
        });

        resolve(incomingStreams);
    });
};

exports.addIncomingStreams = function addIncomingStreams(baseUrl, vhostName, application) {
    return exports.getIncomingStreams(baseUrl, vhostName, application.appName)
        .then( incomingStreams => {
            application.incomingStreams = incomingStreams;
        });
};

exports.getJstreeData = function getJstreeData(vhosts) {

    var data = vhosts.map( vhost => {
        var vhostNode = {};
        vhostNode.text = vhost.vhostName;
        vhostNode.children = vhost.applications.map( application => {
            var applicationNode = {};
            applicationNode.text = application.appName;
            applicationNode.children = application.incomingStreams.map( incomingStream => {
                var incomingStreamNode = {};
                incomingStreamNode.text = incomingStream.streamName;
                incomingStreamNode.type = application.appType;

                return incomingStreamNode;
            });

            return applicationNode;
        });

        return vhostNode;
    });

    return data;
};

var vhosts = [];
var baseUrl = this.getBaseUrl('localhost', 8087);
this.addVHostsName(baseUrl, vhosts)
    .then( () => {
        console.log(JSON.stringify(vhosts));
        console.log( JSON.stringify( exports.getJstreeData(vhosts) ) );
    });