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
var Subject_1 = require('rxjs/Subject');
var JstreeService = (function () {
    function JstreeService() {
        this.menuSelectedSubject = new Subject_1.Subject();
        this.vhostNodeSelectedSubject = new Subject_1.Subject();
        this.connNodeSelectedSubject = new Subject_1.Subject();
        this.menuSelected$ = this.menuSelectedSubject.asObservable();
        this.vhostNodeSelected$ = this.vhostNodeSelectedSubject.asObservable();
        this.connNodeSelected$ = this.connNodeSelectedSubject.asObservable();
    }
    JstreeService.prototype.selectMenu = function (menu) {
        this.menuSelectedSubject.next(menu);
    };
    JstreeService.prototype.selectVhostNode = function (node) {
        this.vhostNodeSelectedSubject.next(node);
    };
    JstreeService.prototype.selectConnNode = function (node) {
        this.connNodeSelectedSubject.next(node);
    };
    JstreeService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], JstreeService);
    return JstreeService;
}());
exports.JstreeService = JstreeService;
