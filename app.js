#!/usr/bin/env node

const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const ipc = require('node-ipc');
const jwt = require('jsonwebtoken');

ipc.config.id = 'nanoStreamWebSockets';
ipc.config.retry = 1500;

let port = 8080;
let host = "0.0.0.0";
let whitelist = undefined;
let jwtSecret = undefined;

let usedJwtTokens = [];

// Process any args passed in and overwrite defaults
const args =  process.argv.slice(2);
args.forEach((arg) => {
  const [key, value] = arg.split('=');
  switch (key) {
  case 'port':
    port = value;
    break;
  case 'host':
    host = value;
    break;
  case 'originWhitelist':
    whitelist = value.split(',').map(w => new RegExp(w.replace('*', '.*')));
    console.debug(`Whitelisting origins: ${value}`);
    break;
  case 'jwtSecret':
    jwtSecret = value;
    console.debug('JWT authentication will apply.');
    break;
  }
});

const wsServer = new http.createServer();

const options = {
  server: wsServer
};

const rejectHandshake = (cb, reason) => {
  cb(false, 401, 'Unauthorized');
  console.error(reason);
};

// Reject the handshake in certain situations
options.verifyClient = (info, cb) => {

  // Check origin against whitelist if supplied
  if (whitelist) {
    if (!whitelist.find(w => info.req.headers.origin.match(w))) {
      return rejectHandshake(cb, `Denied connection to ${info.req.headers.origin} because origin is not in whitelist ${whitelist.join(',')}`);
    }
  }

  // Authenticate against JWT secret if supplied
  if (jwtSecret) {
    const token = url.parse(info.req.url, true).query.t;
    const now = Math.floor(Date.now() / 1000);

    if (!token) { // No token, no access
      return rejectHandshake(cb, `Denied connection to ${info.req.headers.origin} because token not supplied`);
    }

    try {
      var decoded = jwt.verify(token, jwtSecret);

      if (!decoded.exp) { // No expiration set
        return rejectHandshake(cb, `Denied connection to ${info.req.headers.origin} because token expiration was not set`);
      }

      if (usedJwtTokens.find(w => w.t == token)) { // Token has already been used once
        return rejectHandshake(cb, `Denied connection to ${info.req.headers.origin} because token already been used once`);
      }

    } catch(err) { // Token was invalid
      return rejectHandshake(cb, `Denied connection to ${info.req.headers.origin} error was: ${err.message}`);
    }

    // Record this token as having been used, to allow it to be rejected if used again.
    usedJwtTokens.push({t: token, exp: decoded.exp});
    // Purge tokens from usedJwtTokens that have passed their expiration.
    // These will be rejected if used again so we don't need to store them anymore.
    usedJwtTokens = usedJwtTokens.filter(t => t.exp >= now);
  }

  cb(true);
};

const wss = new WebSocket.Server(options);


// Set up ping messages to verify all clients are still connected
function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat); // Pong messages are automatically sent in response to ping messages as required by the spec.
  console.debug(`Client connected from ${req.headers.origin}. Now ${wss.clients.size} connected clients.`);
});

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      console.debug('Dead client terminated.');
      return ws.terminate();
    }

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

wsServer.listen({ port: port, host: host }, (err) => {
  if (err) {
    return console.error('Something bad happened', err);
  }

  console.log(`Websocket server is listening on ${host}:${port}`);
});
