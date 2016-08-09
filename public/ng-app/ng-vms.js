/**
 * Created by manager on 2016-07-14.
 */

function PlayerContainer(num, playerOpt) {
    this.players = new Array(num);
    this.playerings = new Array(num);
    this.playerOpt = playerOpt;

    for(var i = 0; i < this.players.length; i++) {
        this.players[i] = new Clappr.Player(playerOpt);
        this.playerings[i] = false;
    }
}
PlayerContainer.prototype = {
    _getPlayerId : function (playerIndex) {
        return '#video' + playerIndex;
    },
    _isPlaying : function (player) {
        return player.isReady && player.isPlaying();
    },
    _getRemainPlayerIndex : function () {
        for(var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if( this._isPlaying(player) )
                continue;
            return i;
        }
        return -1;
    },
    _playRtmp : function(playerIndex, rtmpSrc) {
        var player = this.players[playerIndex];
        var playerId = this._getPlayerId(playerIndex);

        player.setParentId(playerId);
        player.load(rtmpSrc);
        this.playerings[playerIndex] = true;
    },
    reloadPlayer : function(player) {
        player.load( player.options.sources );
    },
    playRtmpInRemain : function(rtmpSrc) {
        var playerIndex = this.playerings.indexOf(false);
        if( playerIndex !== -1 )
            this._playRtmp(playerIndex, rtmpSrc);

        return playerIndex;
    },
    swapPlayer : function (srcIndex, targetIndex) {
        var src = this.players[srcIndex];
        this.players[srcIndex] = this.players[targetIndex];
        this.players[targetIndex] = src;

        var srcPlaying = this.playerings[srcIndex];
        this.playerings[srcIndex] = this.playerings[targetIndex];
        this.playerings[targetIndex] = srcPlaying;

        if( detectBrowser.isChrome ) {
            if ( this.playerings[srcIndex] ) {
                // this.reloadPlayer(this.players[srcIndex]);
                this.players[srcIndex].destroy();
                this.players[srcIndex].setParentId( this._getPlayerId(srcIndex) );
            }
            if ( this.playerings[targetIndex] ) {
                // this.reloadPlayer(this.players[targetIndex]);
                this.players[targetIndex].destroy();
                this.players[targetIndex].setParentId( this._getPlayerId(targetIndex) );
            }
        }

    }
};

function NavBarMenu(navBarId, activeMenu, vhostTree, connectionTree) {
    this.navBar = $(navBarId);
    this._activeMenu = activeMenu;
    this.vhostTree = vhostTree;
    this.connectionTree = connectionTree;
    this.vhostJsTree = vhostTree.jstree();
    this.connectionJsTree = vhostTree.jstree();

    /**
     * 상단 네비게이션 바 메뉴 onclick
     */
    var navBarMenu = this;
    this.navBar.find('a').on('click', function () {
        var navTabName = $(this).attr('data-item');
        navBarMenu.setActiveMenu(navTabName);
    });
}
NavBarMenu.prototype = {
    setActiveMenu : function (activeMenu) {
        this._activeMenu = activeMenu;
        this.vhostTree.off('changed.jstree');
        switch( this._activeMenu ) {
            case 'Monitoring':
                this._setActiveMonitoring();
                break;
            case 'DVR':
                this._setActiveDvr();
                break;
            case 'Manager':
                this._setActiveManager();
                break;
        }
    },
    _setActiveMonitoring : function () {
        vhostTree.on('changed.jstree', function(e, data) {
            var selNode = data.instance.get_node(data.selected[0]);
            var rtmpSrc = selNode.data.rtmp;

            if( selNode.type === 'LiveStream' ) {
                var index = playerContainer.playRtmpInRemain(rtmpSrc);
                var parentNodeJson = {
                    id : index.toString(),
                    text : (index+1) + '번 영상',
                    state : {opened : true}
                };
                var parentNodeId = connectionJsTree.create_node(null, parentNodeJson, index);
                var parentNode = connectionJsTree.get_node(parentNodeId);
                var liveNodeJson = {
                    text : selNode.text,
                    type : selNode.type
                };
                connectionJsTree.create_node(parentNode, liveNodeJson, 'last');
            }
        });
    },
    _setActiveDvr : function () {
        vhostTree.on('changed.jstree', function(e, data) {

        });
    },
    _setActiveManager : function () {
        var selNode = vhostJsTree.get_selected(true);
        vhostTree.on('changed.jstree', function(e, data) {
            var selNode = data.instance.get_node(data.selected[0]);

            switch(selNode.type) {
                case 'VHost':

                    break;
                case 'Live':
                    break;
                case 'LiveStream':
                    break;
            }
        });
    }
};

function Manager(managerHeaderId, managerSideBarId, streamFilesContentId, transcoderContentId) {
    this.managerHeader = $(managerHeaderId);
    this.managerSideBar = $(managerSideBarId);
    this.streamFilesContent = $(streamFilesContentId);
    this.transcoderContent = $(transcoderContentId);
    this.vhostName = null;
    this.appType = null;
    this.appName = null;
    this.activeSideBarMenu = 'streamfiles'; // streamfiles, transcoder
    /**
     * 관리자기능 사이드바 onclick
     */
    var Manager = this;
    this.managerSideBar.find('.list-group-item').each( function (index) {
        var listItem = $(this);
        var listItemName = listItem.attr('data-item');

        listItem.on('click', function () {
            listItem.siblings().removeClass("active");
            listItem.addClass("active");
        });
        switch( listItemName ) {
            case 'streamfiles' :
                Manager._onClickStreamFilesListItem(listItem);
                break;
            case 'transcoder' :
                Manager._onClickTranscoder(listItem);
                break;
        }
    });
}
Manager.prototype = {
    _onClickStreamFilesListItem : function (listItem) {
        var Manager = this;
        listItem.on('click', function () {
            $.ajax({
                type : 'GET',
                url : 'vms/_defaultVHost_/live/streamfiles',
                success : function (streamFiles) {
                    var streamFilesTbody = Manager.streamFilesContent.find('tbody');
                    streamFilesTbody.empty();
                    streamFiles.forEach( function (streamFile, i) {
                        var tr = $('<tr>');
                        var tds = [
                            $('<td>').text(streamFile),
                            $('<td>').text('행동')
                        ];
                        tr.append(tds);
                        tr.appendTo(streamFilesTbody);
                    });

                },
                error : function (err) {
                    console.error(err);
                }
            });
        });
    },
    _onClickTranscoder : function (listItem) {

    }
};

function init() {
    var videoNum = 9;
    var playerContainer = new PlayerContainer(videoNum, {
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
    });
    /**
     * 서버정보 Jstree
     */
    var vhostTree = $('#vhost-tree').jstree({
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
    var vhostJsTree = vhostTree.jstree();

    /**
     * 영상접속정보 Jstree
     */
    var connectionTree = $('#connection-tree').jstree( {
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
    });
    var connectionJsTree = connectionTree.jstree();

    var navBarMenu = new NavBarMenu('#vms-navbar', 'Monitoring', vhostTree, connectionTree);
    var manager = new Manager('manager-header', '#manager-sidebar', '#manager-streamfiles', '#manager-transcoder');

    /**
     * 웹소켓 통신
     */
    var socket = io('/websocket');
    socket.on('incomingStream', function(streamData) {
        var appNodeId = streamData.vhostName + '>' + streamData.appName;
        var streamNodeId = appNodeId + '>' + streamData.streamName;
        if( streamData.isPublish ) {
            var vhostNode = vhostJsTree.get_node(streamData.vhostName);
            var appNode = vhostJsTree.get_node(appNodeId);
            var streamNodeData = getStreamAddr(vhostNode.data.vhostIp, vhostNode.data.vhostStreamingPort,
                streamData.appName, streamData.appInstanceName, streamData.streamName);
            console.log(appNode);
            var nodeJson = {
                id : streamNodeId,
                text : streamData.streamName,
                type : appNode.type + 'Stream',
                data : streamNodeData
            };
            vhostJsTree.create_node(appNode, nodeJson, 'last');
        } else {
            vhostJsTree.deselect_node(streamNodeId, true);
            vhostJsTree.delete_node(streamNodeId);
        }
    });

    /**
     *  영상 드래그앤드롭 기능
     */
    $('.vms-video')
        .draggable({
            revert: 'invalid',
            helper: 'original',
            snap: true
        })
        .droppable({
            drop: function(event, ui) {
                var src = $(ui.draggable);
                var target = $(this);

                var srcIndex = parseInt( src.attr('id').charAt(5) );
                var targetIndex = parseInt( target.attr('id').charAt(5) );
                var srcVideo = src.children().first();
                var targetVideo = target.children().first();
                src.css({
                    top: 0,
                    left: 0
                }).append(targetVideo);
                target.css({
                    top: 0,
                    left: 0
                }).append(srcVideo);

                // player index 위치 변경
                playerContainer.swapPlayer(srcIndex, targetIndex);

                // connectionTree 노드 위치 변경
                var connectionTreeRootNode = connectionJsTree.get_node("#");
                var srcConnectionNode = connectionJsTree.get_node(srcIndex);
                var targetConnectionNode = connectionJsTree.get_node(targetIndex);
                if( srcConnectionNode && targetConnectionNode ) // ID 중복 방지
                    connectionJsTree.set_id(targetConnectionNode, '-10');
                if( srcConnectionNode )
                    swapJstreeNode(connectionJsTree, connectionTreeRootNode, srcConnectionNode, targetIndex);
                if( targetConnectionNode )
                    swapJstreeNode(connectionJsTree, connectionTreeRootNode, targetConnectionNode, srcIndex);
            }
        });

    /**
     * 리스트 그룹 아이템 onclick 시에 active 변경
     */
    $('.list-group-item').on('click', function (e) {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });
}

/*var vmsAppDom = $('vms-app');
if( vmsAppDom.length ) { vmsAppDom.on('ngAfterViewInit', init) }
else { $(document).ready(init) }*/


/**
 * 관리자기능 사이드바 onclick
 */
/*
$('#manager-sidebar').find('a').each( function (index) {
    var listItem = $(this);
    var listItemName = listItem.attr('data-item');
    switch( listItemName ) {
        case 'streamfiles' :
            listItem.on('click', function () {
                $.ajax({
                    type : 'GET',
                    url : 'vms/_defaultVHost_/live/streamfiles',
                    success : function (streamFiles) {
                        var streamFilesTbody = $('#manager-streamfiles').find('tbody');
                        streamFilesTbody.empty();
                        streamFiles.forEach( function (streamFile, i) {
                            var tr = $('<tr>');
                            var tds = [
                                $('<td>').text(streamFile),
                                $('<td>').text('행동')
                            ];
                            tr.append(tds);
                            tr.appendTo(streamFilesTbody);
                        });

                    },
                    error : function (err) {
                        console.error(err);
                    }
                });
            });
            break;
    }
});
*/





/* 함수 목록 시작 */
function getNextNode(jsTree, id) {
    var rootNode = jsTree.get_node('#');
    for(var i = 0; i < rootNode.children.length; i++) {
        if( rootNode.children[i] > id )
            return i;
    }
    return rootNode.children.length;
}

function swapJstreeNode(jsTree, rootNode, srcNode, targetIndex) {
    jsTree.set_id(srcNode, targetIndex);
    jsTree.rename_node(srcNode, (targetIndex + 1) + '번 영상');
    jsTree.move_node(srcNode, rootNode, getNextNode(connectionJsTree, targetIndex));
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