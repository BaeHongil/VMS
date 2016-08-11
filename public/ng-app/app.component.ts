/**
 * Created by manager on 2016-08-05.
 */
/// <reference path="../js/clappr-rtmp.d.ts" />
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { NavTabs } from './nav-tab/nav-tabs.component';
import { VHostJsTree } from './jstree/vhost-jstree.component';
import { ConnJsTree } from './jstree/conn-jstree.component';
import { Players } from './player/players.component';
import { Manager } from './manager/manager.component';
import { JstreeService } from './jstree/jstree.service';

@Component({
    moduleId: module.id,
    selector: 'vms-app',
    templateUrl: 'app.component.html',
    directives: [NavTabs, VHostJsTree, ConnJsTree, Players, Manager],
    providers: [JstreeService]
})
export class AppComponent implements AfterViewInit {
    tabNames = ['Monitoring', 'DVR', 'Manager'];
    playerIdPrefix = 'video';
    playerOpt = {
        width: '100%',
        height: '100%',
        autoPlay: true,
        chromeless: true,
        playbackNotSupportedMessage : '에러 발생',
        disableKeyboardShortcuts: true,
        plugins: {'playback': [RTMP]},
        rtmpConfig: {
            swfPath: 'assets/RTMP.swf',
            scaling:'stretch',
            playbackType: 'live',
            bufferTime: 1,
            startLevel: 0,
        }
    };
    vhostJsTreeOpt = {
        'core': {
            'data': {
                'url': '/vms/vhost-tree-nodes',
                'dataType': 'json'
            },
            'check_callback' : true,
            "multiple" : false
        },
        'types': {
            'VHost' : {
                'icon': 'css/jstree/vhost.png'
            },
            'Live': {

            },
            'LiveStream' : {
                'icon': 'css/jstree/live-stream.png'
            }
        },
        'plugins': ['types']
    };
    connJsTreeOpt = {
        'core': {
            'check_callback' : true,
            "multiple" : false
        },
        'types': {
            'LiveStream' : {
                'icon': 'css/jstree/live-stream.png'
            }
        },
        'plugins': ['types']
    };

    constructor(private el: ElementRef) {

    }

    ngAfterViewInit() {
        var event = new Event('ngAfterViewInit');
        this.el.nativeElement.dispatchEvent(event);
    }
}