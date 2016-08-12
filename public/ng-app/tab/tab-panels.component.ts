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
        this.activePanelClassesArr = this.activePanelClasses.split(' ');
    }

    ngAfterContentInit() {
        let panelClassesObj = this.stringToObject(this.panelClasses, this.activePanelClassesArr);
        let self = this;
        this.tabPanels.toArray().forEach( (tabPanel: TabPanel, index: number) => {
            tabPanel.setPanelClassesObj( Object.assign({}, panelClassesObj) );
            if( !tabPanel.tabName )
                tabPanel.tabName = this.tabNames[index];
        });
        this.setActivePanel( this.tabNames[0] );
    }

    private stringToObject(classes: string, activeClassesArr: string[]): Object {
        let obj = {};
        classes.split(' ').forEach( (val: string) => {
            obj[val] = true;
        });
        activeClassesArr.forEach( (val: string) => {
            obj[val] = false;
        });

        return obj;
    }

    setActivePanel(activeTabName: string) {
        this.activeTabName = activeTabName;

        this.tabPanels.toArray().forEach( (tabPanel: TabPanel, index: number) => {
            let active = (tabPanel.tabName === this.activeTabName);
            this.activePanelClassesArr.forEach( (className: string) => {
                tabPanel.setPanelClass(className, active);
            });
        });
    }
}

