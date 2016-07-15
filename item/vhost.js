/**
 * Created by manager on 2016-07-14.
 */
module.exports = class VHost {
    constructor(vhostName) {
        this.vhostName = vhostName;
        this.vhostAdminPort = null;
        this.vhostStreamingPort = null;
        this.applications = [];
    }
};