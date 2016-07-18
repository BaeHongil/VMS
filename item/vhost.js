/**
 * Created by manager on 2016-07-14.
 */

module.exports = class VHost {
    constructor(vhostName, vhostIp) {
        this.vhostName = vhostName;
        this.vhostIp = vhostIp;
        this.vhostAdminPort = null;
        this.vhostStreamingPort = null;
        this.applications = [];
    }
};

/*
module.exports = function Vhost(vhostName, vhostIp) {
    this.vhostName = vhostName;
    this.vhostIp = vhostIp;
    this.vhostAdminPort = null;
    this.vhostStreamingPort = null;
    this.applications = [];
};*/
