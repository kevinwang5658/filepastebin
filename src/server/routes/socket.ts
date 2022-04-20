import * as console from 'console';
import { Event, Socket } from 'socket.io';
import { RequestClientAcceptedModel, RequestHostAcceptedModel, RequestHostRequestModel } from '../signaling/entities';
import { HostService } from '../signaling/hostService';
import { HostMap } from '../storage';

const hostMap = HostMap;

export function socketIORouter(socket: Socket): void {
  socket.use(logger);
  socket.on('request-host', (req: RequestHostRequestModel) => {
    const host = HostService.createHost(req);

    socket.join(host.id);
    socket.emit('request-host-accepted', <RequestHostAcceptedModel>{
      roomCode: host.roomCode,
      files: host.files,
    });
    console.info(`Host created: ${host.id}`);

    socket.on('disconnect', () => {
      socket.leave(host.id);
      HostService.destroyHost(host.id);
    });
  });

  socket.on('request-client', (hostId: string) => {
    if (!hostMap.get(hostId)) {
      socket.emit('exception', 'host disconnected');
      return;
    }
    const host = hostMap.get(hostId);

    socket.join(hostId);
    socket.emit('request-client-accepted', <RequestClientAcceptedModel>{
      roomId: host.id,
      files: host.files,
    });

    console.info(`SocketIO client connected: ${hostId}`);
  });

  socket.on('message', (payload: any): void => {
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) socket.to(room).emit('message', payload);
    });
  });

  function logger(event: Event, next): void {
    console.log(`SocketIO message received -- eventName: ${JSON.stringify(event)}, socketId: ${socket.id}`);
    next();
  }
}
