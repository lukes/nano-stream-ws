
# nano-stream-ws

A tiny and performant websocket server that streams block data from a [nano currency](https://nano.org/) node.

## Installation

    npm install --global nano-stream-ws

## Usage

### Start the websocket server

    node app

The server will default to running on port `8080`.

Override this by passing in `port` as an argument:

    node app port=80
