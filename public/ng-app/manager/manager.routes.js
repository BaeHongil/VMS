"use strict";
/**
 * Created by manager on 2016-08-12.
 */
var router_1 = require('@angular/router');
var manager_streamfiles_1 = require('./manager-streamfiles');
var manager_transcoder_component_1 = require('./manager-transcoder.component');
var routerConfig = [
    {
        path: 'manager/streamfiles',
        component: manager_streamfiles_1.ManagerStreamFiles
    },
    {
        path: 'manager/transcoder',
        component: manager_transcoder_component_1.ManagerTranscoder
    }
];
exports.managerRouterProvider = [
    router_1.provideRouter(routerConfig)
];
