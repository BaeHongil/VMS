/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input, OnInit, AfterContentInit} from '@angular/core';

@Component({
    selector: 'tab-panel',
    template: `
        <div [ngClass]="panelClassesObj">
            <ng-content></ng-content>
        </div>
    `
})
export class TabPanel {
    @Input() tabName: string;
    panelClassesObj: Object;
}