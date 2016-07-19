/**
 * Created by manager on 2016-07-14.
 */
var request = require('request');
var Vhost = require('../item/vhost');
var Application = require('../item/application');
var Stream = require('../item/stream');
var JstreeNode = require('../item/jstreenode');

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

exports.getVHosts = function getVHosts(baseUrl) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var vhosts = resJson.vhosts.map( (resVhost, i) => {
            var vhost = new Vhost(resVhost.id, resVhost.connectingIPAddress);
            return vhost;
        });
        resolve(vhosts);
    });
};

exports.addVHosts = function addVHosts(baseUrl, vhosts) {
    return exports.getVHosts(baseUrl)
        .then(resVhosts => {
            var addVhostPortsPromises = resVhosts.map( (vhost, i) => {
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
                applications.push( new Application(application.id, application.appType) );
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
        var incomingStreams = [];
        jsonInstanceList.forEach( (jsonInstance, i) => {
            jsonInstance.incomingStreams.forEach( (jsonIncomingStream, i) => {
                var stream = new Stream(jsonIncomingStream.applicationInstance, jsonIncomingStream.name);
                incomingStreams.push(stream);
            });
        });
        console.log('incomingStreams');
        console.log(incomingStreams);

        resolve(incomingStreams);
    });
};

exports.addIncomingStreams = function addIncomingStreams(baseUrl, vhostName, application) {
    return exports.getIncomingStreams(baseUrl, vhostName, application.appName)
        .then( incomingStreams => {
            application.incomingStreams = incomingStreams;
        });
};

exports.getVhosts = function getVhosts(ip, port) {
    var baseUrl = exports.getBaseUrl('localhost', 8087);
    var vhosts = [];
    return exports.addVHosts(baseUrl, vhosts).then( () => {
        return vhosts;
    });
};

exports.getJstreeData = function getJstreeData(vhosts) {

    var data = vhosts.map( vhost => {
        var vhostNode = new JstreeNode(vhost.vhostName, vhost.vhostName, 'VHost');
        vhostNode.state = {opened : true};
        vhostNode.data = {
            vhostIp : vhost.vhostIp,
            vhostStreamingPort : vhost.vhostStreamingPort
        };
        vhostNode.children = vhost.applications.map( application => {
            var appNodeId = vhostNode.id + '>' + application.appName;
            var applicationNode = new JstreeNode(appNodeId, application.appName, application.appType);
            applicationNode.children = application.incomingStreams.map( incomingStream => {
                var streamNodeId = appNodeId + '>' + incomingStream.streamName;
                var incomingStreamNode = new JstreeNode(streamNodeId, incomingStream.streamName, application.appType + 'Stream');
                incomingStreamNode.data = getStreamAddr(
                    vhost.vhostIp,
                    vhost.vhostStreamingPort,
                    application.appName,
                    incomingStream.appInstanceName,
                    incomingStream.streamName
                );

                return incomingStreamNode;
            });

            return applicationNode;
        });

        return vhostNode;
    });

    return data;
};

function getStreamAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'http://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName
        + '/playlist.m3u8';

    return addr;
}

/*
var vhosts = [];
var baseUrl = this.getBaseUrl('localhost', 8087);
this.addVHosts(baseUrl, vhosts)
    .then( () => {
        console.log(JSON.stringify(vhosts));
        console.log( JSON.stringify( exports.getJstreeData(vhosts) ) );
    });*/
