/**
 * Created by manager on 2016-08-08.
 */
import { Component, Input, OnInit } from '@angular/core';
import { ManagerService } from './manager.service';
import { NabTabService } from "../nav-tab/nav-tab.service";
import {Router} from "@angular/router";
import {JstreeService} from "../jstree/jstree.service";
import {Subscription} from "rxjs/Rx";

@Component({
    moduleId: module.id,
    selector: 'manager-pane',
    templateUrl: 'manager.component.html',
    providers: [ManagerService]
})
export class Manager implements OnInit {
    @Input() name: string;
    managerTypes = [
        {
            typeName: 'VHost',
            tabs: [
                {
                    name: '설정',
                    urlName: 'manager/streamfiles'
                },
                {
                    name: 'Source 인증',
                    urlName: 'manager/transcoder'
                }
            ]
        },
        {
            typeName: 'Application',
            tabs: [
                {
                    name: '스트림 파일',
                    urlName: 'manager/streamfiles'
                },
                {
                    name: '트랜스코딩',
                    urlName: 'manager/transcoder'
                }
            ]
        }
    ];
    managerTypeName: string;
    vhostNode: any;
    nodeName: string;
    visible: boolean;
    vhostTreeSubs: Subscription;


    constructor(
        private nabTabService: NabTabService,
        private managerService: ManagerService,
        private jstreeService: JstreeService,
        private router: Router) { }

    ngOnInit() {
        this.nabTabService.nabTabSelected$.subscribe( (navTabName: string) => {
            this.visible = (this.name === navTabName);
            this.managerService.setManagerVisible(this.visible);

            if( this.visible ) {
                this.subscribeVhostTree();
            }
            else if( !this.vhostTreeSubs.isUnsubscribed ) {
                this.vhostTreeSubs.unsubscribe();
                this.routerInit();
                this.managerTypeName = null;
                this.vhostNode = null;
            }
        });
    }

    private subscribeVhostTree() {
        this.vhostTreeSubs = this.jstreeService.vhostNodeSelected$.subscribe(
            vhostNode => {
                this.vhostNode = vhostNode;
                switch(vhostNode.type) {
                    case 'VHost':
                        this.managerTypeName = 'VHost';
                        break;
                    case 'Live':
                        this.managerTypeName = 'Application';
                        break;
                    case 'LiveStream':
                        this.managerTypeName = 'Application';
                        break;
                }
                this.routerInit();
            }
        );
    }

    private routerInit() {
        let linkUri = '/manager';
        this.router.navigateByUrl(linkUri);
    }

    onClickTab() {

    }

    setManagerType(typeName: string) {
        this.managerTypeName = typeName;
    }

    getTabNames() {
        let curManagerType = {};
        this.managerTypes.some( (managerType) => {
            if( managerType.typeName === this.managerTypeName ) {
                curManagerType = managerType;
                return true;
            }
        });

        return curManagerType;
    }
}