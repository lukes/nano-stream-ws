
# nano-stream-ws

A tiny and performant websocket server that streams block data from a [nano currency](https://nano.org/) node.

It builds on the socket stream of block data set up by the [nano-stream-x](https://github.com/lukes/nano-stream-x) library, which is packaged in this library as a dependency.

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
