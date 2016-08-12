"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by manager on 2016-08-11.
 */
var core_1 = require('@angular/core');
var TabPanel = (function () {
    function TabPanel(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    TabPanel.prototype.setPanelClassesObj = function (panelClassesObj) {
        this.panelClassesObj = panelClassesObj;
        for (var className in panelClassesObj) {
            this.setPanelClass(className, panelClassesObj[className]);
        }
    };
    TabPanel.prototype.setPanelClass = function (className, active) {
        this.renderer.setElementClass(this.el.nativeElement, className, active);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabPanel.prototype, "tabName", void 0);
    TabPanel = __decorate([
        core_1.Component({
            selector: 'tab-panel',
            template: "\n            <ng-content></ng-content>\n    "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], TabPanel);
    return TabPanel;
}());
exports.TabPanel = TabPanel;
