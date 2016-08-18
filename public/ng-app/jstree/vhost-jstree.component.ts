/**
 * Created by manager on 2016-08-09.
 */
import {Component, ElementRef, AfterViewInit} from '@angular/core';
import { JsTree } from './jstree.component';
import { JstreeService } from './jstree.service';
import {NabTabService} from "../nav-tab/nav-tab.service";
import {Subscription} from "rxjs/Rx";
import {ManagerService} from "../manager/manager.service";

@Component({
    moduleId: module.id,
    selector: 'vhost-jstree',
    template: '<div></div>'
})
export class VHostJsTree extends JsTree implements AfterViewInit{
    nabTabSelectedSubs: Subscription;
    constructor(
        elementRef: ElementRef,
        jstreeService: JstreeService,
        private nabTabService: NabTabService,
        private managerService: ManagerService) {
        super(elementRef, jstreeService);
    }

    ngOnInit() {
        super.ngOnInit();

        let socket = io('/websocket');
        socket.on('incomingStream', streamData => {
            let appNodeId = streamData.vhostName + '>' + streamData.appName;
            let streamNodeId = appNodeId + '>' + streamData.streamName;
            if( streamData.isPublish ) {
                let vhostNode = this.jsTree.get_node(streamData.vhostName);
                let appNode = this.jsTree.get_node(appNodeId);
                let streamNodeData = this.getStreamData(streamData.vhostName, vhostNode.data.vhostIp, vhostNode.data.vhostStreamingPort,
                    streamData.appName, streamData.appInstanceName, streamData.streamName);
                console.log(appNode);
                let nodeJson = {
                    id : streamNodeId,
                    text : streamData.streamName,
                    type : appNode.type + 'Stream',
                    data : streamNodeData
                };
                this.jsTree.create_node(appNode, nodeJson, 'last');
            } else {
                this.jsTree.deselect_node(streamNodeId, true);
                this.jsTree.delete_node(streamNodeId);
            }
        });

        this.nabTabSelectedSubs = this.nabTabService.nabTabSelected$.subscribe(
            (navTabName: string) => {
                if( navTabName === 'Manager' )
                    this.addDisconnBtn();
                else
                    this.removeDisconnBtn();
            }
        );
    }

    ngAfterViewInit() {

        /*console.log('ngAfterViewInit');
        this.jsTree.add_action('all', {
            id: 'actionRemove',
            text: '',
            class: 'action-delete',
            after: true,
            selector: 'a',
            event: 'click',
            callback: (node_id, node, action_id, action_el) => {
                console.log("callback", node_id, action_id);
            }
        });
        console.log('add_action');*/

    }

    private addDisconnBtn() {
        this.jsTree.add_button('LiveStream', 'action-delete', node => {
            let vhostName = node.data.vhostName;
            let appName = node.data.appName;
            let appInstName = node.data.appInstanceName;
            let incomingStreamName = node.data.streamName;
            let res = this.managerService.disconnectIncomingStream(vhostName, appName, appInstName, incomingStreamName);
            res.subscribe(status => {
                console.log('addDisconnBtn statusCodes : ' + status);
            }, console.error);
        });
    }

    private removeDisconnBtn() {
        this.jsTree.remove_button('LiveStream');
    }


    selectNode(selNode:any) {
        this.jstreeService.selectVhostNode(selNode);
        console.log( this.jsTree.get_type(selNode) );
    }

    private getStreamData(vhostName: string, ip: string, port: number,
                          appName: string, appInstanceName: string, streamName: string) {
        return {
            vhostName: vhostName,
            appName: appName,
            appInstanceName: appInstanceName,
            streamName: streamName,
            hls : this.getHlsAddr(ip, port, appName, appInstanceName, streamName),
            rtmp : this.getRtmpAddr(ip, port, appName, appInstanceName, streamName)
        };
    }

    private getHlsAddr(ip: string, port: number, appName: string, appInstanceName: string, streamName: string) {
        var addr = 'http://' + ip + ':' + port + '/'
            + appName + '/' + appInstanceName + '/' + streamName
            + '/playlist.m3u8';

        return addr;
    }

    private getRtmpAddr(ip: string, port: number, appName: string, appInstanceName: string, streamName: string) {
        var addr = 'rtmp://' + ip + ':' + port + '/'
            + appName + '/' + appInstanceName + '/' + streamName;

        return addr;
    }
}