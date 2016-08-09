/**
 * Created by manager on 2016-08-09.
 */
interface RTMP {

}
interface Player {
    new(opt: Object): Player;
    setParentId(id: string);
    load(src: string);
    destroy();
}

declare var RTMP: RTMP;
declare var Clappr: {Player};