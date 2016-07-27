/**
 * Created by manager on 2016-07-15.
 */

function PlayerContainer(num, playerOpt) {
    this.players = new Array(num);
    this.playerOpt = playerOpt;

    for(var i = 0; i < this.players.length; i++)
        this.players[i] = 3;
}

var p = new PlayerContainer(3, 44);
console.log(p);