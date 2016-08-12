/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input, ElementRef, Renderer, OnInit, AfterContentInit} from '@angular/core';

@Component({
    selector: 'tab-panel',
    template: `
            <ng-content></ng-content>
    `
})
export class TabPanel {
    @Input() tabName: string;
    panelClassesObj: Object;

    constructor(private el: ElementRef, private renderer: Renderer) { }

    setPanelClassesObj(panelClassesObj: Object) {
        this.panelClassesObj = panelClassesObj;
        for(let className in panelClassesObj) {
            this.setPanelClass(className, panelClassesObj[className]);
        }
    }

    setPanelClass(className: string, active: boolean) {
        this.renderer.setElementClass(this.el.nativeElement, className, active);
    }
}