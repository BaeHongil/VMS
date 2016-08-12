"use strict";
/**
 * Created by manager on 2016-08-08.
 */
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_component_1 = require('./app.component');
var http_1 = require('@angular/http');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    http_1.HTTP_PROVIDERS
]);
