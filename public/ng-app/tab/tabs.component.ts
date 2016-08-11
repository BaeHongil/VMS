/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'tabs',
    template: `
        <div [ngClass]="tabsClasses">
            <a href="#" *ngFor="let tabName of tabNames; let i=index"
                (click)="selectTab(tabName)"
                [ngClass]="setTabClasses(tabName)" >
                {{tabName}}
            </a>
        </div>
    `
})
export class Tabs implements OnInit {
    @Input() tabsClasses: string;
    @Input() tabClasses: string;
    @Input() activeClass: string;
    @Input() tabNames: Array<string>;
    @Output() selectTabEvent = new EventEmitter();
    tabClassesObj: Object;
    activeTabName: string;


    ngOnInit() {
        this.activeTabName = this.tabNames[0];
        this.tabClassesObj = this.stringToObject(this.tabClasses, this.activeClass);
    }

    stringToObject(arr: string, activeClass: string): Object {
        let obj = {};
        arr.split(' ').forEach( (val: string) => {
            obj[val] = true;
        });
        obj[activeClass] = false;

        return obj;
    }

    setTabClasses(tabName: string) {
        this.tabClassesObj[this.activeClass] = ( tabName === this.activeTabName );

        return this.tabClassesObj;
    }

    selectTab(tabName: string) {
        this.activeTabName = tabName;
        this.selectTabEvent.emit(tabName);
    }
}