import * as http from 'http';
import * as App from './app';
import { HostModel } from './models/host-model';
import { SocketManager } from './signaling/socket-manager';

//TODO: Switch from a map to redis in the future
const hostMap = new Map<string, HostModel>();
const roomCodeToRoomIdMap = new Map<string, string>();

const app = App.newInstance(hostMap, roomCodeToRoomIdMap);
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
const socketManager = new SocketManager(server, hostMap, roomCodeToRoomIdMap);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
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

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
