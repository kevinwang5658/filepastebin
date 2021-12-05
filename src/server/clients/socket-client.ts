import { Socket } from "socket.io";
import { Server } from "http";
import { Host } from "../signaling/host";
import { Constants } from "../../shared/constants";
import RequestHostRequestModel = Constants.RequestHostRequestModel;
import { Guest } from "../signaling/guest";
import CONNECT = Constants.CONNECT;
import DISCONNECT = Constants.DISCONNECT;
import { RoomsMap, RoomCodeToRoomIdMap } from './temp';

const SocketIO = require('socket.io');

class Client {

  private io: SocketIO.Server;

  init(server: Server) {
    this.io = new SocketIO(server, {
      pingTimeout: 30000,
    });
    this.io.on(CONNECT, this.connection);
  }

  private connection = (socket: Socket) => {
    socket.on(Constants.REQUEST_HOST, (req: RequestHostRequestModel) => {
      const host = new Host(socket, this.io, RoomsMap, RoomCodeToRoomIdMap);
      host.createHost(req);

      socket.on(DISCONNECT, () => host.destroyHost())
    });

    socket.on(Constants.REQUEST_GUEST, (roomId: string) => {
      const guest = new Guest(socket, this.io, RoomsMap, roomId);
      guest.joinRoomAsGuest();
    });

    socket.on(Constants.MESSAGE, (payload: any) => {
      Object.keys(socket.rooms).forEach((room) => {
        if (room !== socket.id) socket.to(room).send(payload)
      })
    });
  }
}

export const SocketClient = new Client();
