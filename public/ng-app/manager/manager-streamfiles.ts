/**
 * Created by manager on 2016-08-08.
 */
import { Component, OnInit } from '@angular/core';
import { ManagerService } from './manager.service';
import { JstreeService } from '../jstree/jstree.service';
import { Subscription, Observable } from "rxjs/Rx";

@Component({
    moduleId: module.id,
    selector: 'manager-streamfiles',
    templateUrl: 'manager-streamfiles.html'
})
export class ManagerStreamFiles implements OnInit {
    vhostNodeSelectedSubs: Subscription;
    managerVisibleSubs: Subscription;
    vhostName: string;
    appName: string;
    streamFiles: Observable<Object>;
    visible: boolean;

    constructor(
        private managerService: ManagerService,
        private jstreeService: JstreeService) {}

    ngOnInit() {
        let currentVhostNode = this.jstreeService.currentVhostNode;
        if( currentVhostNode ) {
            this.splitVhostNode(this.jstreeService.currentVhostNode);
            this.getStreamFiles();
        }
        this.vhostNodeSelectedSubs = this.jstreeService.vhostNodeSelected$.subscribe( vhostNode => {
            this.splitVhostNode(vhostNode);
            this.getStreamFiles();
        });
        /*this.managerVisibleSubs = this.managerService.managerVisible$.subscribe( (visible: boolean) => {
            this.visible = visible;
            this.getStreamFiles();
        })*/
    }

    getStreamFiles() {
        if( this.appName )
            this.streamFiles = this.managerService.getStreamFiles(this.vhostName, this.appName);
    }

    private splitVhostNode(vhostNode: any) {
        let splitedId = vhostNode.id.split('>');
        if( splitedId.length >= 2 )
            this.appName = splitedId[1];
        else
            this.appName = null;
        this.vhostName = splitedId[0];
    }
}