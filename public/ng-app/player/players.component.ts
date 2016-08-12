///<reference path="../../js/clappr-rtmp.d.ts"/>
/**
 * Created by manager on 2016-08-08.
 */
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NumToArr } from '../num-to-arr.pipe';
import { Subscription } from "rxjs/Rx";
import { JstreeService } from '../jstree/jstree.service';
import { NabTabService } from '../nav-tab/nav-tab.service';

@Component({
    moduleId: module.id,
    selector: 'players',
    templateUrl: 'players.component.html',
    pipes: [NumToArr]
})
export class Players implements OnInit, AfterViewInit {
    @Input() name: string;
    @Input() idPrefix: string;
    @Input() playerOpt: Object;
    players: Array<Player>;
    playings: Array<boolean>;
    playerNum: number;
    private sqrtPlayerNum: number;
    vhostTreeSubs: Subscription;
    nabTabSelectedSubs: Subscription;

    constructor(private jstreeService: JstreeService,
                private nabTabService: NabTabService) { }

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

        this.subscribeVhostTree();
        this.nabTabSelectedSubs = this.nabTabService.nabTabSelected$.subscribe(
            (navTabName: string) => {
                if( navTabName !== name && !this.vhostTreeSubs.isUnsubscribed ) { // 플레이어 탭이 아닐 때
                    this.vhostTreeSubs.unsubscribe();
                    this.stopAllPlayers();
                }
                else {
                    this.subscribeVhostTree();
                    this.reloadAllPlayers();
                }
            }
        )
    }

    ngAfterViewInit() {
        jQuery('.vms-video')
            .draggable({
                revert: 'invalid',
                helper: 'original',
                snap: true
            })
            .droppable({
                drop: (event, ui) => {
                    let src = $(ui.draggable);
                    let target = $(this);

                    let srcIndex = parseInt( src.attr('id').charAt(5) );
                    let targetIndex = parseInt( target.attr('id').charAt(5) );
                    let srcVideo = src.children().first();
                    let targetVideo = target.children().first();
                    let cssData = {
                        top: 0,
                        left: 0
                    };
                    src.css(cssData).append(targetVideo);
                    target.css(cssData).append(srcVideo);

                    // player index 위치 변경
                    this.swapPlayer(srcIndex, targetIndex);
                    this.jstreeService.swapPlayer({
                        srcIndex: srcIndex,
                        targetIndex: targetIndex
                    });
                }
            });
    }

    private subscribeVhostTree() {
        this.vhostTreeSubs = this.jstreeService.vhostNodeSelected$.subscribe(
            vhostNode => {
                if( vhostNode.type === 'LiveStream' ) {
                    let rtmpSrc = vhostNode.data.rtmp;
                    let index = this.playRtmpInRemain(rtmpSrc);
                    let liveNodeJson = {
                        text : vhostNode.text,
                        type : vhostNode.type
                    };
                    let playData = {
                        index: index,
                        liveNodeJson: liveNodeJson
                    };
                    this.jstreeService.playStreaming(playData);
                }
            }
        );
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

    private stopAllPlayers() {
        this.players.forEach( (player, index) => {
            if( this.playings[index] )
                player.stop();
        });
    }

    private reloadAllPlayers() {
        this.players.forEach( (player, index) => {
            if( this.playings[index] )
                player.load( player.options.sources );
        });
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