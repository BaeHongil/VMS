/**
 * Created by manager on 2016-07-14.
 */
var videoNum = 9;
var videoArr = new Array(videoNum);
var isInVideoArr = new Array(videoNum);
for(var i = 0; i < videoNum; i++) {
    var videoId = 'video' + ( i+1 );
    videoArr[i] = videojs(videoId);
    isInVideoArr[i] = false;
}

var vhostTree = $('#vhost-tree');
vhostTree.jstree({
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
});
vhostTree.on("changed.jstree", function (e, data) {
    var selNode = data.instance.get_node(data.selected[0]);
    var rtmpSrc = selNode.data.rtmp;
    console.log(selNode);

    if( selNode.type === 'LiveStream' ) {
        var videoIndex = isInVideoArr.indexOf(false);
        if( videoIndex != -1 ) {
            isInVideoArr[videoIndex] = true;
            var player = videoArr[videoIndex];

            playRtmp(player, rtmpSrc);
        }
    }
});

var socket = io('/websocket');

vhostJstree = vhostTree.jstree();
socket.on('incomingStream', function(streamData) {
    var appNodeId = streamData.vhostName + '>' + streamData.appName;
    var streamNodeId = appNodeId + '>' + streamData.streamName;
    if( streamData.isPublish ) {
        var vhostNode = vhostJstree.get_node(streamData.vhostName);
        var appNode = vhostJstree.get_node(appNodeId);
        var streamNodeData = getStreamAddr(vhostNode.data.vhostIp, vhostNode.data.vhostStreamingPort,
                streamData.appName, streamData.appInstanceName, streamData.streamName);
        console.log(appNode);
        var node = {
            id : streamNodeId,
            text : streamData.streamName,
            type : appNode.type + 'Stream',
            data : streamNodeData
        };
        vhostJstree.create_node(appNode, node, 'last');
    } else {
        vhostJstree.deselect_node(streamNodeId, true);
        vhostJstree.delete_node(streamNodeId);
    }
});

function playHls(player, hlsSrc) {
    player.src({
        src: hlsSrc,
        type: 'application/x-mpegURL'
    });
    player.play();
}

function playRtmp(player, rtmpSrc) {
    player.src({
        src: rtmpSrc,
        type: 'rtmp/mp4'
    });
    player.play();
}

function getStreamAddr(ip, port, appName, appInstanceName, streamName) {
    return {
        hls : getHlsAddr(ip, port, appName, appInstanceName, streamName),
        rtmp : getRtmpAddr(ip, port, appName, appInstanceName, streamName)
    };
}

function getHlsAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'http://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName
        + '/playlist.m3u8';

    return addr;
}

function getRtmpAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'rtmp://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName;

    return addr;
}