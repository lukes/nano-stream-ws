
# nano-stream-ws

A tiny and performant websocket server that streams block data from a [nano currency](https://nano.org/) node.

It builds on the socket stream of block data set up by the [nano-stream-x](https://github.com/lukes/nano-stream-x) library, which is packaged in this library as a dependency.

## Installation

    npm install --global nano-stream-ws

## Usage

You first start the stream of socket data from [nano-stream-x](https://github.com/lukes/nano-stream-x) and then start the websocket server.

### Start the stream

    npm run stream

This will start a streaming server on `127.0.0.1:3000`. To override those defaults:

    npm run stream host=ipv6-localhost port=3001

### Start the websocket server

    npm run websockets

The websocket server will run on port `8080`. To override this:

    npm run websockets port=8081
