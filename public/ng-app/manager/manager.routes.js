"use strict";
/**
 * Created by manager on 2016-08-12.
 */
var router_1 = require('@angular/router');
var manager_streamfiles_1 = require('./manager-streamfiles');
var manager_transcoder_component_1 = require('./manager-transcoder.component');
var manager_blank_component_1 = require("./manager-blank.component");
var manager_component_1 = require("./manager.component");
var managerRoutes = [
    {
        path: 'manager',
        component: manager_component_1.Manager,
        children: [
            {
                path: 'streamfiles/:id',
                component: manager_streamfiles_1.ManagerStreamFiles
            },
            {
                path: 'transcoder/:id',
                component: manager_transcoder_component_1.ManagerTranscoder
            },
            {
                path: ':id',
                component: manager_blank_component_1.ManagerBlank
            }
        ]
    }
];
exports.managerRouting = router_1.RouterModule.forChild(managerRoutes);
