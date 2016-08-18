/**
 * Created by BHI on 2016-07-16.
 */
var WebSocket = require('ws');
var wowzalib = require('./wowza-lib');

module.exports = function(server) {
    var io = require('socket.io')(server);
    var websocket = io
        .of('/websocket')
        .on('connection', socket => {
            /*websocket.emit('msg', {
             text: 'hi'
             });*/
        });

    var wowzaIp = process.argv[3];
    var wowzaRestApiPort = process.argv[4];
    wowzalib.getWebsocketAddrs(wowzaIp, wowzaRestApiPort)
        .then( websocketAddrs => {
            websocketAddrs.forEach( websocketAddr => {
                var ws = new WebSocket(websocketAddr);
                ws.on('error', function (error) {
                    console.error(websocketAddr + ' - Wowza Vhost와의 Websocket 연결 실패')
                });
                ws.on('open', function(){
                    console.log(websocketAddr + ' - Wowza Vhost와의 Websocket 연결 성공');
                });
                ws.on('message', function (data, flags) {
                    websocket.emit('incomingStream', JSON.parse(data));
                    console.log(data);
                });
            } );
        });

    return io;
};

/*
var wowzaWebsocket = new WebSocket('ws://localhost:8086/websocket');
wowzaWebsocket.onmessage = function(event) {
    console.log(event);
}
*/

