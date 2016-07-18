/**
 * Created by manager on 2016-07-14.
 */
var vhostTree = $('#vhost-tree');
vhostTree.jstree({
    'core': {
        'data': {
            'url': 'http://localhost:3000/vms/vhost-tree-nodes',
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
    console.log("The selected nodes are:");
    console.log( JSON.stringify( data.instance.get_node(data.selected[0]).data ) );
});

var socket = io('http://localhost:3000/websocket');

vhostJstree = vhostTree.jstree();
socket.on('incomingStream', function(data) {
    var appNodeId = data.vhostName + '>' + data.appName;
    var streamNodeId = appNodeId + '>' + data.streamName;
    if( data.isPublish ) {
        var vhostNode = vhostJstree.get_node(data.vhostName);
        var appNode = vhostJstree.get_node(appNodeId);
        console.log(appNode);
        var node = {
            id : streamNodeId,
            text : data.streamName,
            type : appNode.type + 'Stream',
            data : 'http://' + vhostNode.data.vhostIp + ':' + vhostNode.data.vhostStreamingPort + '/'
            + data.appName + '/' + data.appInstanceName + '/' + data.streamName
            + '/playlist.m3u8'
        };
        vhostJstree.create_node(appNode, node, 'last');
    } else {
        vhostJstree.delete_node(streamNodeId);
    }
});

