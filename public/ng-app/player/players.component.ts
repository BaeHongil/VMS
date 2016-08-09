///<reference path="../../js/clappr-rtmp.d.ts"/>
/**
 * Created by manager on 2016-08-08.
 */
import { Component, Input, OnInit } from '@angular/core';
import { NumToArr } from '../num-to-arr.pipe';
import { Subscription } from "rxjs/Rx";
import { JstreeService } from '../jstree/jstree.service'


@Component({
    selector: 'players',
    templateUrl: 'ng-app/player/players.component.html',
    pipes: [NumToArr]
})
export class Players implements OnInit {
    @Input() idPrefix: string;
    @Input() playerOpt: Object;
    players: Array<Player>;
    playings: Array<boolean>;
    playerNum: number;
    private sqrtPlayerNum: number;
    vhostTreeSubs: Subscription;

    constructor(private jstreeService: JstreeService) { }

    @Input('num')
    set playerNumStr(playerNumStr: string) {
        this.playerNum = parseInt(playerNumStr);
        this.sqrtPlayerNum = Math.ceil( Math.sqrt(this.playerNum) );
    }

    ngOnInit() {
        this.players = new Array(this.playerNum);
        this.playings = new Array(this.playerNum);

        for(let i = 0; i < this.players.length; i++) {
            this.players[i] = new Clappr.Player(this.playerOpt);
            this.playings[i] = false;
        }
        console.log(this.players);
        this.vhostTreeSubs = this.jstreeService.vhostNodeSelected$.subscribe(
            vhostNode => {
                if( vhostNode.type === 'LiveStream' ) {
                    var rtmpSrc = vhostNode.data.rtmp;
                    var index = this.playRtmpInRemain(rtmpSrc);
                    /*var parentNodeJson = {
                        id : index.toString(),
                        text : (index+1) + '번 영상',
                        state : {opened : true}
                    };
                    var parentNodeId = connectionJsTree.create_node(null, parentNodeJson, index);
                    var parentNode = connectionJsTree.get_node(parentNodeId);
                    var liveNodeJson = {
                        text : vhostNode.text,
                        type : vhostNode.type
                    };
                    connectionJsTree.create_node(parentNode, liveNodeJson, 'last');*/
                }
            }
        )
    }

    private getPlayerId(playerIndex: number): string {
        return '#' + this.idPrefix + playerIndex;
    }

    private playRtmp(playerIndex: number, rtmpSrc: string) {
        let player = this.players[playerIndex];
        let playerId = this.getPlayerId(playerIndex);

        console.log(playerId);
        player.setParentId(playerId);
        player.load(rtmpSrc);
        this.playings[playerIndex] = true;
    }

    playRtmpInRemain(rtmpSrc: string): number {
        let playerIndex = this.playings.indexOf(false);
        if( playerIndex !== -1 )
            this.playRtmp(playerIndex, rtmpSrc);

        return playerIndex;
    }

    swapPlayer(srcIndex: number, targetIndex: number) {
        let src = this.players[srcIndex];
        this.players[srcIndex] = this.players[targetIndex];
        this.players[targetIndex] = src;

        let srcPlaying = this.playings[srcIndex];
        this.playings[srcIndex] = this.playings[targetIndex];
        this.playings[targetIndex] = srcPlaying;

        if( detectBrowser.isChrome ) {
            if ( this.playings[srcIndex] ) {
                this.players[srcIndex].destroy();
                this.players[srcIndex].setParentId( this.getPlayerId(srcIndex) );
            }
            if ( this.playings[targetIndex] ) {
                this.players[targetIndex].destroy();
                this.players[targetIndex].setParentId( this.getPlayerId(targetIndex) );
            }
        }
    }
}