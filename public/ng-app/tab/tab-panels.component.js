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
var tab_panel_component_1 = require('./tab-panel-component');
var TabPanels = (function () {
    function TabPanels() {
    }
    TabPanels.prototype.ngOnInit = function () {
        this.activeTabName = this.tabNames[0];
        this.activePanelClassesArr = this.activePanelClasses.split(' ');
    };
    TabPanels.prototype.ngAfterContentInit = function () {
        var self = this;
        var panelClassesObj = this.stringToObject(this.panelClasses, this.activePanelClassesArr);
        this.tabPanels.toArray().forEach(function (tabPanel) {
            tabPanel.panelClassesObj = Object.assign({}, panelClassesObj);
            self.setPanelClass(tabPanel.tabName, tabPanel.panelClassesObj);
        });
    };
    TabPanels.prototype.stringToObject = function (classes, activeClassesArr) {
        var obj = {};
        classes.split(' ').forEach(function (val) {
            obj[val] = true;
        });
        activeClassesArr.forEach(function (val) {
            obj[val] = false;
        });
        return obj;
    };
    TabPanels.prototype.setPanelClass = function (tabName, prePanelClassObj) {
        var active = (tabName === this.activeTabName);
        this.activePanelClassesArr.forEach(function (val) {
            prePanelClassObj[val] = active;
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TabPanels.prototype, "tabNames", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabPanels.prototype, "activeTabName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabPanels.prototype, "panelClasses", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabPanels.prototype, "activePanelClasses", void 0);
    __decorate([
        core_1.ContentChildren(tab_panel_component_1.TabPanel), 
        __metadata('design:type', core_1.QueryList)
    ], TabPanels.prototype, "tabPanels", void 0);
    TabPanels = __decorate([
        core_1.Component({
            selector: 'tab-panels',
            template: "\n        <ng-content select=\"tab-panel\"></ng-content>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], TabPanels);
    return TabPanels;
}());
exports.TabPanels = TabPanels;
