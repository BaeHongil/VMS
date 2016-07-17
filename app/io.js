/**
 * Created by BHI on 2016-07-16.
 */
var WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:8086/websocket');
ws.on('error', function (error) {
    console.error('Wowza 서버와의 Websocket 연결 실패')
});
ws.on('open', function(){
    console.log('open');
});


module.exports = function(server) {
    var io = require('socket.io')(server);

    var websocket = io
        .of('/websocket')
        .on('connection', socket => {
            websocket.emit('msg', {
                text: 'hi'
            });
        });

    if(ws) {
        ws.on('message', function (data, flags) {
            websocket.emit('msg', JSON.parse(data));
            console.log(data);
        });
    }

    return io;
};

/*
var wowzaWebsocket = new WebSocket('ws://localhost:8086/websocket');
wowzaWebsocket.onmessage = function(event) {
    console.log(event);
}
*/

