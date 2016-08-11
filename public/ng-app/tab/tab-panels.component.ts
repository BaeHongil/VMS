/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input, ContentChildren, QueryList, OnInit, AfterContentInit} from '@angular/core';
import { TabPanel } from './tab-panel-component';

@Component({
    selector: 'tab-panels',
    template: `
        <ng-content select="tab-panel"></ng-content>
    `
})
export class TabPanels implements OnInit, AfterContentInit {
    @Input() tabNames: string[];
    @Input() activeTabName: string;
    @Input() panelClasses: string;
    @Input() activePanelClasses: string;
    activePanelClassesArr: string[];
    @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;

    ngOnInit() {
        this.activeTabName = this.tabNames[0];
        this.activePanelClassesArr = this.activePanelClasses.split(' ');
    }

    ngAfterContentInit() {
        let self = this;
        let panelClassesObj = this.stringToObject(this.panelClasses, this.activePanelClassesArr);
        this.tabPanels.toArray().forEach( (tabPanel: TabPanel) => {
            tabPanel.panelClassesObj = Object.assign({}, panelClassesObj);
            self.setPanelClass( tabPanel.tabName, tabPanel.panelClassesObj);
        });
    }

    stringToObject(classes: string, activeClassesArr: string[]): Object {
        let obj = {};
        classes.split(' ').forEach( (val: string) => {
            obj[val] = true;
        });
        activeClassesArr.forEach( (val: string) => {
            obj[val] = false;
        });

        return obj;
    }

    setPanelClass(tabName: string, prePanelClassObj: Object) {
        let active = (tabName === this.activeTabName);
        this.activePanelClassesArr.forEach( (val: string) => {
            prePanelClassObj[val] = active;
        });
    }
}

