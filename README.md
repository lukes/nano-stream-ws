
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

    nano-stream-x host=ipv6-localhost port=3001

### Start the websocket server

    nano-stream-ws

The websocket server will run on port `8080`. To override this:

    nano-stream-ws port=8081

### Authentication

By default the websocket server will accept connections from anywhere. You may wish to lock down the connections by using a token standard called [JWT](https://jwt.io/introduction/). If the `jwtSecret` argument is passed, the server will expect a client to connect with a JWT.

    nano-stream-ws jwtSecret=my_secret

See [using JWT with nano-stream-ws](https://github.com/lukes/nano-stream-ws/wiki/Authenticating-with-JSON-Web-Tokens-(JWT)) for more on what should be in the JWT token.

### Whitelisting

Use the `originWhitelist` argument to restrict connections from specific domains. Note that this is not a particularly secure measure as people can set referrer origin headers themselves, but can be used if you wish to try to lock down connections somewhat without any guarantees.

    nano-stream-ws port=8081 originWhitelist=localhost,*.mydomain.com

### See

* [Running in production](https://github.com/lukes/nano-stream-ws/wiki/Running-in-production) wiki page
