"use strict";
/**
 * Created by manager on 2016-08-08.
 */
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_component_1 = require('./app.component');
var ng2_dnd_1 = require('ng2-dnd/ng2-dnd');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    ng2_dnd_1.DND_PROVIDERS
]);
