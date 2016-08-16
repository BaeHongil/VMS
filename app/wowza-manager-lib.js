/**
 * Created by manager on 2016-08-01.
 */
var request = require('request');
var wowzaLib = require('./wowza-lib');

function getStreamFiles(baseUrl, vhostName, appName) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles';

    return wowzaLib.requestGetRestApi(url, (resJson, resolve, reject) => {
        var streamIds = resJson.streamFiles.map( (resStreamFile, i) => {
            return resStreamFile.id;
        });
        resolve(streamIds);
    });
}
exports.getStreamFiles = getStreamFiles;

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

function modifyStreamFile(baseUrl, vhostName, appName, streamFileName, uri) {
    let url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles/'
        + streamFileName;
    let body = {
        uri: uri
    };

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

