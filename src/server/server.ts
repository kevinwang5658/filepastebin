#!/usr/server/env node

import * as http from "http";
import * as App from "./app";
import { SocketClient } from './clients/socket-client';
import { Logger } from './config/logger';

const PORT = process.env.PORT || '3000';
const logger = Logger;

function main() {
  const app = App.newInstance();
  const server = http.createServer(app);
  SocketClient.init(server);

  app.set('port', PORT);
  server.listen(PORT);
  server.on('error', onError);
  server.on('listening', onListening);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info('Listening on Port: ' + PORT);
}

main();
