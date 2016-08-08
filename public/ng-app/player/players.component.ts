/**
 * Created by manager on 2016-08-08.
 */
import { Component, Input } from '@angular/core';
import { NumToArr, Sqrt } from '../num-to-arr.pipe';

@Component({
    selector: 'players',
    templateUrl: 'ng-app/player/players.component.html',
    pipes: [NumToArr, Sqrt]
})
export class Players {
    playerNum: number;
    private sqrtPlayerNum: number;

    constructor() { }

    @Input('num')
    set playerNumStr(playerNumStr: string) {
        this.playerNum = parseInt(playerNumStr);
        this.sqrtPlayerNum = Math.ceil( Math.sqrt(this.playerNum) );
    }
}