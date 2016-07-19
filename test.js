/**
 * Created by manager on 2016-07-15.
 */

var videoNum = 9;
var videoArr = new Array(videoNum);
var isInVideoArr = new Array(videoNum);
for(var i = 0; i < videoNum; i++) {
    var videoId = 'video' + ( i+1 );
    console.log(videoId);
    isInVideoArr[i] = true;
}

function getEmptyVideoIndex() {
    isInVideoArr.forEach( function (isInVideo, i) {
        if( !isInVideo ) {
            console.log(i);
            return i;
        }
    });
    return -1;
}
isInVideoArr[1] = true;
console.log( isInVideoArr.indexOf(false) );