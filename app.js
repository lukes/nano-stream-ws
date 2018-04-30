const http = require('http');
const WebSocket = require('ws');
const ipc = require('node-ipc');

ipc.config.id = 'nanoStreamWebSockets';
ipc.config.retry = 1500;

const wsServer = new http.createServer();
const wss = new WebSocket.Server({ server: wsServer });

const CONF = {
  port: 8080
};

// Process any args passed in and overwrite defaults
const args =  process.argv.slice(2);
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  CONF[key] = value;
});

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

wsServer.listen(CONF, (err) => {
  if (err) {
    return console.error('Something bad happened', err);
  }

  console.log(`Websocket server is listening on ${CONF.port}`);
});
