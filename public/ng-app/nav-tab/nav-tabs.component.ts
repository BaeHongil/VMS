/**
 * Created by manager on 2016-08-11.
 */
import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'nav-tabs',
    templateUrl: 'nav-tab.component.html'
})
export class NavTabs {
    @Input() tabNames: Array<string>;
    seletedTabIndex = 0;

    onTabClick(index: number) {
        this.seletedTabIndex = index;
    }
}