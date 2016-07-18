/**
 * Created by manager on 2016-07-14.
 */
module.exports = function Application (appName, appType) {
    this.appName = appName;
    this.appType = appType;
    this.incomingStreams = [];
};