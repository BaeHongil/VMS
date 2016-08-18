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
 * Created by manager on 2016-08-08.
 */
var core_1 = require('@angular/core');
var JsTree = (function () {
    function JsTree(elementRef, jstreeService) {
        this.jstreeService = jstreeService;
        this.el = elementRef.nativeElement;
    }
    JsTree.prototype.ngOnInit = function () {
        jQuery(this.el).jstree(this.jsTreeOpt);
        this.jsTree = jQuery(this.el).jstree(true);
        this.setChangedJsTreeListener();
    };
    JsTree.prototype.setChangedJsTreeListener = function () {
        var _this = this;
        jQuery(this.el).on('changed.jstree', function (e, data) {
            var selNode = data.instance.get_node(data.selected[0]);
            _this.selectNode(selNode);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], JsTree.prototype, "jsTreeOpt", void 0);
    return JsTree;
}());
exports.JsTree = JsTree;
