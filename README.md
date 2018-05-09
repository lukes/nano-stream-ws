
# nano-stream-ws

A tiny and performant websocket server that streams block data from a [nano currency](https://nano.org/) node.

It builds on the socket stream of block data set up by the [nano-stream-x](https://github.com/lukes/nano-stream-x) library.

## Installation

Install both [`nano-stream-x`](https://github.com/lukes/nano-stream-x) and `nano-stream-ws` as global packages:

    npm install --global nano-stream-x
    npm install --global nano-stream-ws

## Usage

### Start the stream

    nano-stream-x

This will start a streaming server on `127.0.0.1:3000`. To override these:

    nano-stream-x host=ip6-localhost port=3001

### Start the websocket server

    nano-stream-ws

The websocket server will bind to host `0.0.0.0` on port `8080`. To override these:

    nano-stream-ws host="127.0.0.1" port=8081

### Configure your Nano node to send data to nano-stream-x

Your Nano node is easily configured to send block processing data to a server (in this case `nano-stream-x`). See the [wiki article](https://github.com/lukes/nano-stream-x/wiki/Configure-your-Nano-node-to-send-data-to-the-nano-stream-x) (external link) for how to set this up.

### Authentication

By default the websocket server will accept connections from anywhere. You may wish to lock down the connections by using a token standard called [JWT](https://jwt.io/introduction/). If the `jwt_secret` argument is passed, the server will expect a client to connect with a JWT.

    nano-stream-ws jwt_secret=my_secret

See [using JWT with nano-stream-ws](https://github.com/lukes/nano-stream-ws/wiki/Authenticating-with-JSON-Web-Tokens-(JWT)) for more on what should be in the JWT token.

### Whitelisting

Use the `origin_whitelist` argument to restrict connections from specific domains. Note that this is not a particularly secure measure as people can set referrer origin headers themselves, but can be used if you wish to try to lock down connections somewhat without any guarantees.

    nano-stream-ws origin_whitelist=localhost,*.mydomain.com

### See

* [Running in production](https://github.com/lukes/nano-stream-ws/wiki/Running-in-production) wiki page
