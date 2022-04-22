import * as console from 'console';
import { Event, Socket } from 'socket.io';
import { RequestClientAcceptedModel, RequestHostAcceptedModel, RequestHostRequestModel } from '../signaling/entities';
import { RoomService } from '../signaling/roomService';
import { RoomMap } from '../storage';

const roomMap = RoomMap;

export function socketIORouter(socket: Socket): void {
  socket.use(logger);
  socket.on('request-host', (req: RequestHostRequestModel, callback) => {
    const room = RoomService.createRoom(req);

    socket.join(room.id);
    callback(<RequestHostAcceptedModel>{
      roomCode: room.roomCode,
      files: room.files,
    });
    console.info(`Host created: ${room.id}`);

    socket.on('disconnect', () => {
      socket.leave(room.id);
      RoomService.destroyRoom(room.id);
    });
  });

  socket.on('request-client', (roomId: string, callback) => {
    if (!roomMap.get(roomId)) {
      socket.emit('exception', 'host disconnected');
      return;
    }
    const host = roomMap.get(roomId);
    socket.join(roomId);
    socket.to(roomId).emit('new-client-joined');


    callback(<RequestClientAcceptedModel>{
      roomId: host.id,
      files: host.files,
    });

    console.info(`SocketIO client connected: ${roomId}`);
  });

  socket.on('message', (payload: any): void => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit('message', payload);
      }
    });
  });

  function logger(event: Event, next): void {
    console.log(`SocketIO message received -- eventName: ${JSON.stringify(event)}, socketId: ${socket.id}`);
    next();
  }
}
