const http = require('http');
const WebSocket = require('ws');
const ipc = require('node-ipc');

ipc.config.id = 'nanoStreamWebSockets';
ipc.config.retry = 1500;

const wsServer = new http.createServer();
const wss = new WebSocket.Server({ server: wsServer });
const wssPort = 8080;

ipc.connectTo(
  'nanoStream', () => {
    ipc.of.nanoStream.on(
      'payload', // topic
      function(data){
        console.debug('Sending websocket data to all clients');
        wss.clients.forEach(ws => ws.send(data));
      }
    );
  }
);

wsServer.listen(wssPort, (err) => {
  if (err) {
    return console.error('something bad happened', err);
  }

  console.log(`websocket server is listening on ${wssPort}`);
});
