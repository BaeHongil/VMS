/**
 * Created by manager on 2016-08-01.
 */
var request = require('request');
var wowzaLib = require('./wowza-lib');
var StreamFile = require('../item/streamfile');

function getStreamFiles(baseUrl, vhostName, appName) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles';

    return wowzaLib.requestGetRestApi(url, (resJson, resolve, reject) => {
        let streamFilesPromises = resJson.streamFiles.map( (resStreamFile, i) => {
            return getStreamFile(baseUrl, vhostName, appName, resStreamFile.id);
        });

        resolve( Promise.all(streamFilesPromises) );
    });
}
exports.getStreamFiles = getStreamFiles;

function getStreamFile(baseUrl, vhostName, appName, streamFileName) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles/'
        + streamFileName;

    return wowzaLib.requestGetRestApi(url, (resJson, resolve, reject) => {
        let streamFile = new StreamFile(resJson.name, resJson.uri);
        resolve(streamFile);
    });
}

function createStreamFile(baseUrl, vhostName, appName, streamFileName, uri) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles';
    let body = {
        name: streamFileName,
        uri: uri
    };

    return wowzaLib.requestPostRestApi(url, body, (resJson, statusCode, resolve, reject) => {
        resolve(statusCode);
    });
}
exports.createStreamFile = createStreamFile;

function modifyStreamFile(baseUrl, vhostName, appName, streamFileName, streamFile) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles/'
        + streamFileName;
    let body = streamFile;

    return wowzaLib.requestPutRestApi(url, body, (resJson, statusCode, resolve, reject) => {
        resolve(statusCode);
    });
}
exports.modifyStreamFile = modifyStreamFile;

function deleteStreamFile(baseUrl, vhostName, appName, streamFileName) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles/'
        + streamFileName;

    return wowzaLib.requestDeleteRestApi(url, (resJson, statusCode, resolve, reject) => {
        resolve(statusCode);
    });
}
exports.deleteStreamFile = deleteStreamFile;

function connectStreamFile(baseUrl, vhostName, appName, appInstanceName, streamFileName, mediaCasterType) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles/'
        + streamFileName + '/actions/connect?connectAppName=' + appName
        + '&appInstance=' + appInstanceName + '&mediaCasterType=' + mediaCasterType;
    let body = {};

    return wowzaLib.requestPutRestApi(url, body, (resJson, statusCode, resolve, reject) => {
        resolve(statusCode);
    });
}
exports.connectStreamFile = connectStreamFile;

function disconnectIncomingStream(baseUrl, vhostName, appName, appInstanceName, incomingStreamName) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/instances/' + appInstanceName
        + '/incomingstreams/' + incomingStreamName + '/actions/' + 'disconnectStream';
    let body = {};

    return wowzaLib.requestPutRestApi(url, body, (resJson, statusCode, resolve, reject) => {
        resolve(statusCode);
    });
}
exports.disconnectIncomingStream = disconnectIncomingStream;

/*
getStreamFiles(wowzaLib.getBaseUrl('192.168.0.183', 8087), '_defaultVHost_', 'live')
    .then(console.log);*/
