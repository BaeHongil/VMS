/**
 * Created by manager on 2016-08-09.
 */
import { Component, ElementRef  } from '@angular/core';
import { JsTree } from './jstree.component';
import { JstreeService } from './jstree.service';

@Component({
    selector: 'vhost-jstree',
    template: '<div></div>'
})
export class VHostJsTree extends JsTree {
    constructor(
        elementRef: ElementRef,
        jstreeService: JstreeService) {
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
                let streamNodeData = this.getStreamAddr(vhostNode.data.vhostIp, vhostNode.data.vhostStreamingPort,
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
    }

    selectNode(selNode:any) {
        this.jstreeService.selectVhostNode(selNode);
    }

    private getStreamAddr(ip, port, appName, appInstanceName, streamName) {
        return {
            hls : this.getHlsAddr(ip, port, appName, appInstanceName, streamName),
            rtmp : this.getRtmpAddr(ip, port, appName, appInstanceName, streamName)
        };
    }

    private getHlsAddr(ip, port, appName, appInstanceName, streamName) {
        var addr = 'http://' + ip + ':' + port + '/'
            + appName + '/' + appInstanceName + '/' + streamName
            + '/playlist.m3u8';

        return addr;
    }

    private getRtmpAddr(ip, port, appName, appInstanceName, streamName) {
        var addr = 'rtmp://' + ip + ':' + port + '/'
            + appName + '/' + appInstanceName + '/' + streamName;

        return addr;
    }
}