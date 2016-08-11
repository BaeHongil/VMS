/**
 * Created by manager on 2016-08-08.
 */
import { Component } from '@angular/core';
import { ManagerStreamFiles } from './manager-streamfiles';
import { TabPanel, TabPanels, Tabs } from '../tab/index';

@Component({
    moduleId: module.id,
    selector: 'manager-pane',
    templateUrl: 'manager.component.html',
    directives: [ManagerStreamFiles, Tabs, TabPanels, TabPanel]
})
export class Manager {
    tabNames = ['스트림 파일', '트랜스코딩', 'Link1'];
    onClick() {

    }

    selectTabEvent(tabName: string) {

    }
}