#!/usr/server/env node

import * as http from "http";
import * as App from "./app";
import { SocketManager } from "./signaling/socket-manager";
import { HostModel } from "./models/host-model";

/**
 * Environment variables
 */

require('dotenv').config();

/**
 * Module dependencies.
 */

const debug = require('debug')('filepastebin:server');

//TODO: Switch from a map to redis in the future
const hostMap = new Map<string, HostModel>();
const roomCodeToRoomIdMap = new Map<string, string>()

/**
 * Get port from environment and store in Express.
 */

let app = App.newInstance(hostMap, roomCodeToRoomIdMap);

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const socketManager = new SocketManager(server, hostMap, roomCodeToRoomIdMap);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
