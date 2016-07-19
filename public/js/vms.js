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
    var hlsSrc = selNode.data;
    console.log(selNode);

    if( selNode.type === 'LiveStream' ) {
        var videoIndex = isInVideoArr.indexOf(false);
        if( videoIndex != -1 ) {
            isInVideoArr[videoIndex] = true;
            var player = videoArr[videoIndex];

            playVideo(player, hlsSrc);
        }
    }
});

var socket = io('/websocket');

vhostJstree = vhostTree.jstree();
socket.on('incomingStream', function(data) {
    var appNodeId = data.vhostName + '>' + data.appName;
    var streamNodeId = appNodeId + '>' + data.streamName;
    if( data.isPublish ) {
        var vhostNode = vhostJstree.get_node(data.vhostName);
        var appNode = vhostJstree.get_node(appNodeId);
        var streamData = getStreamAddr(vhostNode.data.vhostIp, vhostNode.data.vhostStreamingPort, data.appName, data.appInstanceName, data.streamName);
        console.log(appNode);
        var node = {
            id : streamNodeId,
            text : data.streamName,
            type : appNode.type + 'Stream',
            data : streamData
        };
        vhostJstree.create_node(appNode, node, 'last');
    } else {
        vhostJstree.delete_node(streamNodeId);
    }
});

function playVideo(player, hlsSrc) {
    player.src({
        src: hlsSrc,
        type: 'application/x-mpegURL'
    });
    player.play();
}

function getStreamAddr(ip, port, appName, appInstanceName, streamName) {
    var addr = 'http://' + ip + ':' + port + '/'
        + appName + '/' + appInstanceName + '/' + streamName
        + '/playlist.m3u8';

    return addr;
}