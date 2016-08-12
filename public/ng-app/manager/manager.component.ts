/**
 * Created by manager on 2016-08-08.
 */
import { Component, Input, OnInit } from '@angular/core';
import { ManagerStreamFiles } from './manager-streamfiles';
import { ManagerService } from './manager.service';
import { TabPanel, TabPanels, Tabs } from '../tab/index';
import { NabTabService } from "../nav-tab/nav-tab.service";
import { managerRouterProvider } from './manager.routes';

@Component({
    moduleId: module.id,
    selector: 'manager-pane',
    templateUrl: 'manager.component.html',
    directives: [ManagerStreamFiles, Tabs, TabPanels, TabPanel],
    providers: [ManagerService, managerRouterProvider]
})
export class Manager implements OnInit {
    @Input() name: string;
    visible: boolean;
    tabNames = [
        {
            name: '스트림 파일',
            urlName: 'streamfiles'
        },
        {
            name: '트랜스코딩',
            urlName: 'transcoder'
        }
    ];

    constructor(
        private nabTabService: NabTabService,
        private managerService: ManagerService) { }

    ngOnInit() {
        this.nabTabService.nabTabSelected$.subscribe( (navTabName: string) => {
            this.visible = (this.name === navTabName);
            this.managerService.setManagerVisible(this.visible);
        });
    }

    onClickTab() {

    }
}