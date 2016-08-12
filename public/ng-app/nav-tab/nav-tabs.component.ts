/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input, OnInit } from '@angular/core';
import { NabTabService } from './nav-tab.service';

@Component({
    moduleId: module.id,
    selector: 'nav-tabs',
    templateUrl: 'nav-tab.component.html'
})
export class NavTabs implements OnInit {
    @Input() tabNames: Array<string>;
    seletedTabIndex = 0;
    seletedTabName: string;

    constructor(private nabTabService: NabTabService) {}

    ngOnInit() {
        this.seletedTabName = this.tabNames[0];
    }

    onTabClick(index: number, tabName: string) {
        this.seletedTabIndex = index;
        this.seletedTabName = tabName;
        this.nabTabService.selectNavTab(tabName);
    }
}