#!/usr/bin/env node

const http = require('http');
const WebSocket = require('ws');
const ipc = require('node-ipc');

ipc.config.id = 'nanoStreamWebSockets';
ipc.config.retry = 1500;

const wsServer = new http.createServer();
const wss = new WebSocket.Server({ server: wsServer });

let port = 8080;
let whitelist = undefined;

// Process any args passed in and overwrite defaults
const args =  process.argv.slice(2);
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  switch (key) {
  case 'port':
    port = value;
    break;
  case 'originWhitelist':
    whitelist = value.split(',').map(w => new RegExp(w.replace('*', '.*')));
    console.debug(`Whitelisting origins: ${value}`);
    break;
  }
});

// Set up ping messages to verify all clients are still connected
function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws, req) => {
  if (whitelist) {
    if (!whitelist.find(w => req.headers.origin.match(w))) {
      ws.terminate();
      console.info(`Denied connection to ${req.headers.origin} because origin is not in whitelist ${whitelist.join(',')}`);
      return;
    }
  }

  ws.isAlive = true;
  ws.on('pong', heartbeat); // Pong messages are automatically sent in response to ping messages as required by the spec.
  console.debug(`Client connected from ${req.headers.origin}. Now ${wss.clients.size} connected clients.`);
});

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

ipc.connectTo(
  'nanoStream', () => {
    ipc.of.nanoStream.on(
      'payload', // topic
      (data) => {
        if (wss.clients.size > 0) {
          console.debug(`Sending websocket data to ${wss.clients.size} clients`);
          wss.clients.forEach(ws => ws.send(data));
        } else {
          console.debug('Payload received, but there are no connected clients');
        }
      }
    );
  }
);

wsServer.listen({ port: port }, (err) => {
  if (err) {
    return console.error('Something bad happened', err);
  }

  console.log(`Websocket server is listening on ${port}`);
});
