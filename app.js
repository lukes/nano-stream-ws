const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
// const path = require('path');
var ipc = require('node-ipc');

// ipc.config.id = 'nano-stream-ws';
ipc.config.retry = 1500;

const wsServer = new http.createServer();
const wss = new WebSocket.Server({ server: wsServer });
const wssPort = 8080;

wss.on('connection', function connection(ws) {
  console.log('Connection!');
  // ws.on('message', function incoming(message) {
  //   console.log('received: %s', message);
  // });
});

ipc.connectTo(
  'nanoStream', () => {
    // ipc.of.nanoStream.on(
    //     'connect',
    //     function(){
    //         ipc.log('## connected to nanoStream ##'.rainbow, ipc.config.delay);
    //         ipc.of.nanoStream.emit(
    //             'message',  //any event or message type your server listens for
    //             'hello'
    //         )
    //     }
    // );
    // ipc.of.nanoStream.on(
    //   'disconnect',
    //   function(){
    //       ipc.log('disconnected from nanoStream'.notice);
    //   }
    // );
    ipc.of.nanoStream.on(
      'payload',  // any event or message type your server listens for
      function(data){
        // ipc.log('got a message from nanoStream : '.debug, data);
        console.log('Sending websocket data to all clients');
        // wss.emit(data);
        wss.clients.forEach(ws => ws.send(data));
      }
    );
  }
);

wsServer.listen(wssPort, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`websocket server is listening on ${wssPort}`)
});
