/**
 * Created by manager on 2016-08-01.
 */
var request = require('request');
var wowzaLib = require('./wowza-lib');

function getStreamFiles(baseUrl, vhostName, appName) {
    var url = baseUrl + '/v2/servers/_defaultServer_/vhosts/'
        + vhostName + '/applications/' + appName + '/streamfiles';

    return wowzaLib.requestGetRestApi(url, (resJson, resolve, reject) => {
        var streamIds = resJson.streamFiles.map( (resStreamFile, i) => {
            return resStreamFile.id;
        });
        resolve(streamIds);
    });
}
exports.getStreamFiles = getStreamFiles;

getStreamFiles(wowzaLib.getBaseUrl('192.168.0.183', 8087), '_defaultVHost_', 'live')
    .then(console.log);