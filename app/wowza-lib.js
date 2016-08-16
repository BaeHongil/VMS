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

/**
 * 특정 url로 비동기로 json request
 * @param url 요청할 url
 * @param reqJsonProcessor 받은 json을 처리할 콜백함수
 * @returns {Promise}
 */
function requestGetRestApi(url, reqJsonProcessor) {
    var callerFuncName = getFuncName(true);
    var requestOption = {
        method: 'GET',
        url: url,
        json: true
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

            var resJson = body;
            reqJsonProcessor(resJson, resolve, reject);
        });
    });
}
exports.requestGetRestApi = requestGetRestApi;

function requestPostRestApi(url, body, reqJsonProcessor) {
    var callerFuncName = getFuncName(true);
    var requestOption = {
        method: 'POST',
        url: url,
        json: true,
        body: body
    };

    return new Promise( (resolve, reject) => {
        request(requestOption, (err, res, body) => {
            if (err) {
                reject(err);
                return console.error(callerFuncName +' throw err');
            }
            /*if (res.statusCode != 200) {
                reject(callerFuncName + ' statusCode is not 200');
                return console.error(callerFuncName +' statusCode : ' + res.statusCode);
            }*/

            var resJson = body;
            reqJsonProcessor(resJson, res.statusCode, resolve, reject);
        });
    });
}
exports.requestPostRestApi = requestPostRestApi;

function requestPutRestApi(url, body, reqJsonProcessor) {
    var callerFuncName = getFuncName(true);
    var requestOption = {
        method: 'PUT',
        url: url,
        json: true,
        body: body
    };

    return new Promise( (resolve, reject) => {
        request(requestOption, (err, res, body) => {
            if (err) {
                reject(err);
                return console.error(callerFuncName +' throw err');
            }
            /*if (res.statusCode != 200) {
             reject(callerFuncName + ' statusCode is not 200');
             return console.error(callerFuncName +' statusCode : ' + res.statusCode);
             }*/

            var resJson = body;
            reqJsonProcessor(resJson, res.statusCode, resolve, reject);
        });
    });
}
exports.requestPutRestApi = requestPutRestApi;

function requestDeleteRestApi(url, reqJsonProcessor) {
    var callerFuncName = getFuncName(true);
    var requestOption = {
        method: 'DELETE',
        json: true,
        url: url
    };

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

            var resJson = body;
            reqJsonProcessor(resJson, res.statusCode, resolve, reject);
        });
    });
}
exports.requestDeleteRestApi = requestDeleteRestApi;

function getBaseUrl(ip, port) {
    var url = 'http://' + ip + ':' + port;
    return url;
}
exports.getBaseUrl = getBaseUrl;


/**
 * Vhosts 목록 획득
 * @param baseUrl getBaseUrl함수로 얻은 url
 * @returns {Promise}
 */
exports.getVhosts = function getVhosts(baseUrl) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts';

    return requestGetRestApi(url, (resJson, resolve, reject) => {
        var vhosts = resJson.vhosts.map( (resVhost, i) => {
            var vhost = new Vhost(resVhost.id, resVhost.connectingIPAddress);
            return vhost;
        });
        resolve(vhosts);
    });
};

/**
 * Vhosts 포트 목록 획득
 * @param baseUrl getBaseUrl함수로 얻은 url
 * @param vhostName vhost의 이름
 * @return {Promise}
 */
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


/**
 * Vhost 객체에 vhosts port 객체를 추가
 * @param baseUrl getBaseUrl함수로 얻은 url
 * @param vhost port를 추가 vhost 객체
 * @returns {Promise.<TResult>}
 */
exports.addVhostPorts = function addVhostPorts(baseUrl, vhost) {
    return exports.getVhostPorts(baseUrl, vhost.vhostName)
        .then( vhostPorts => {
            vhost.vhostAdminPort = vhostPorts.vhostAdminPort;
            vhost.vhostStreamingPort = vhostPorts.vhostStreamingPort;
            return vhost;
        } );
};

/**
 * Application 객체 획득
 * @param baseUrl getBaseUrl함수로 얻은 url
 * @param vhostName vhost의 이름
 * @param isOnlyLive Live Application만 얻을 시에는 true, 아니면 false.
 * @returns {Promise}
 */
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

/**
 * Application의 현재 incoming stream 목록 획득
 * @param baseUrl
 * @param vhostName
 * @param appName
 * @returns {Promise}
 */
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

/**
 * stream, application이 모두 포함된 vhosts 객체 획득
 * @param ip Wowza 서버 IP
 * @param port Wowza REST API 포트
 * @returns {Promise.<TResult>}
 */
exports.getVhostsObj = function getVhosts(ip, port) {
    var baseUrl = getBaseUrl(ip, port);
    var vhosts = [];

    var vhostsPromise = exports.getVhosts(baseUrl)
        .then( resVhosts => {
            vhosts = resVhosts;
            var vhostPortsPromises = vhosts.map( (vhost, i) => {
                var vhostPortsPromise = exports.addVhostPorts(baseUrl, vhost);
                var applicationsPromise = exports.getApplications(baseUrl, vhost.vhostName, true)
                    .then( applications => {
                        vhost.applications = applications;
                        var incomingStreamsPromises = applications.map( (application, i) => {
                            var incomingStreamsPromise = exports.getIncomingStreams(baseUrl, vhost.vhostName, application.appName)
                                .then( incomingStreams => {
                                    application.incomingStreams = incomingStreams;
                                });

                            return incomingStreamsPromise;
                        });

                        return Promise.all(incomingStreamsPromises);
                    } );

                return Promise.all( [vhostPortsPromise, applicationsPromise] );
            });

            return Promise.all(vhostPortsPromises);
        })
        .then( () => {
            return vhosts;
        });

    return vhostsPromise;
};

/**
 * vhosts 객체를 Jstree에서 사용할 수 있는 Data 형식으로 변환
 * @param vhosts getVhostsObj에서 얻은 vhosts 객체
 * @returns {*|{}|U[]|JQuery|Array|any}
 */
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
    return {
        hls : getHlsAddr(ip, port, appName, appInstanceName, streamName),
        rtmp : getRtmpAddr(ip, port, appName, appInstanceName, streamName)
    };
}

function getHlsAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'http://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName
        + '/playlist.m3u8';

    return addr;
}

function getRtmpAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'rtmp://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName;

    return addr;
}

/**
 * Wowza 서버 websocket 주소 획득
 * @param ip Wowza 서버 IP
 * @param port Wowza Admin 포트
 * @returns {Promise.<TResult>}
 */
exports.getWebsocketAddrs = function getWebsocketAddrs(ip, port) {
    var baseUrl = getBaseUrl(ip, port);

    var websocketAddrsPromise = exports.getVhosts(baseUrl)
        .then( vhosts => {
            var vhostPortsPromises = vhosts.map( (vhost, i) => {
                var vhostPortsPromise = exports.addVhostPorts(baseUrl, vhost);
                return vhostPortsPromise;
            });

            return Promise.all(vhostPortsPromises);
        })
        .then( vhosts => {
            var websocketAddrs = vhosts.map( (vhost, i) => {
                return getWebsocketAddr(vhost.vhostIp, vhost.vhostAdminPort);
            });

            return websocketAddrs;
        });

    return websocketAddrsPromise;
};

function getWebsocketAddr(ip, port) {
    return 'ws://' + ip + ':' + port + '/websocket';
}
