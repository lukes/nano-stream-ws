
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

## Authentication

Authentication can happen through [JWT](https://jwt.io/). If an `jwtSecret` argument is passed, the server will expect a client to connect with an `Authorization` header using the `Bearer` schema containing the JWT token.

    nano-stream-ws jwtSecret=my_secret

The JWT token should [follow the spec](https://jwt.io/) and contain a `header`, `payload` and `signature`.

Example connection request:

    Authorization: Bearer <token>

## Whitelisting

Use the `originWhitelist` to restrict connections from specific domains. Any connections from sites not in the list will be denied.

    nano-stream-ws port=8081 originWhitelist=localhost,*.mydomain.com
