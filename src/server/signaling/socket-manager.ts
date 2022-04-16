import { Server } from 'http';
import SocketIO, { Socket } from 'socket.io';
import { Constants } from '../constants';
import { HostMap, RoomCodeToRoomIdMap } from '../storage';
import { Client } from './client';
import { Host } from './host';
import CONNECT = Constants.CONNECT;
import DISCONNECT = Constants.DISCONNECT;
import RequestHostRequestModel = Constants.RequestHostRequestModel;

export class SocketManager {

  readonly io: SocketIO.Server;

  constructor(private server: Server) {
    this.io = SocketIO(server, {
      pingTimeout: 30000,
    });
    this.io.on(CONNECT, this.connection);
  }

  private connection = (socket: Socket): void => {
    socket.on(Constants.REQUEST_HOST, (req: RequestHostRequestModel) => {
      const host = new Host(socket, this.io, HostMap, RoomCodeToRoomIdMap);
      host.createHost(req);

      socket.on(DISCONNECT, () => host.destroyHost());
    });

    socket.on(Constants.REQUEST_CLIENT, (roomId: string) => {
      const client = new Client(socket, this.io, HostMap, roomId);
      client.createClient();
    });
  };
}
