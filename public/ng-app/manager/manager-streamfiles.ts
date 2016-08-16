/**
 * Created by manager on 2016-08-08.
 */
import { Component, OnInit } from '@angular/core';
import { ManagerService } from './manager.service';
import { JstreeService } from '../jstree/jstree.service';
import { Subscription, Observable } from "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'manager-streamfiles',
    templateUrl: 'manager-streamfiles.html',
    styles: [`
        .streamfile-name {
            font-size: 16px;
        }
    `]
})
export class ManagerStreamFiles implements OnInit {
    routeSubs: Subscription;
    vhostName: string;
    appName: string;
    streamFiles: Observable<Object>;
    targetStreamFile = {
        name: '',
        uri: ''
    };
    isStreamFile = {
        name: true,
        uri: true
    };
    isDuplicateFileName = false;

    constructor(
        private managerService: ManagerService,
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeSubs = this.route.params.subscribe( params => {
            if( params['id'] ) {
                let id = params['id'];
                this.splitVhostNode(id);
                this.getStreamFiles();
            }

        });
    }

    getStreamFiles() {
        this.streamFiles = this.managerService.getStreamFiles(this.vhostName, this.appName);
    }

    private splitVhostNode(nodeId: any) {
        let splitedId = nodeId.split('>');
        if( splitedId.length >= 2 )
            this.appName = splitedId[1];
        else
            this.appName = null;
        this.vhostName = splitedId[0];
    }

    actionBtnClick(streamFileName: string) {
        this.targetStreamFile.name = streamFileName;
    }

    createOkBtnClick() {
        this.isStreamFile.name = ( this.targetStreamFile.name ? true : false );
        this.isStreamFile.uri = ( this.targetStreamFile.uri ? true : false );

        if( this.isStreamFile.name && this.isStreamFile.uri ) {
            let res = this.managerService.postStreamFile(this.vhostName, this.appName, this.targetStreamFile);
            res.subscribe(status => {
                this.getStreamFiles();
                jQuery('#create-streamfile').modal('hide');
            }, err => {
                if( err.status == 409 )
                    this.isDuplicateFileName = true;
                else
                    jQuery('#create-streamfile').modal('hide');
            });
            this.resetModalData();
        }
    }

    modifyOkBtnClick() {
        this.isStreamFile.uri = ( this.targetStreamFile.uri ? true : false );

        if( this.isStreamFile.uri ) {
            let res = this.managerService.putStreamFile(this.vhostName, this.appName, this.targetStreamFile.name, this.targetStreamFile.uri);
            res.subscribe(status => {
                this.getStreamFiles();
                jQuery('#modify-streamfile').modal('hide');
            }, err => {
                console.error(err);
                jQuery('#modify-streamfile').modal('hide');
            });
            this.resetModalData();
        }
    }

    deleteOkBtnClick() {
        let res = this.managerService.deleteStreamFile(this.vhostName, this.appName, this.targetStreamFile.name);
        res.subscribe(status => {
            this.getStreamFiles();
            jQuery('#delete-streamfile').modal('hide');
        }, err => {
            console.error(err);
            jQuery('#delete-streamfile').modal('hide');
        });
        this.resetModalData();
    }

    private resetModalData() {
        this.targetStreamFile.name = '';
        this.targetStreamFile.uri = '';
        this.isStreamFile.name = true;
        this.isStreamFile.uri = true;
        this.isDuplicateFileName = false;
    }
}