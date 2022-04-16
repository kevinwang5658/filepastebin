import * as randomstring from 'randomstring';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { HostMap, RoomCodeToHostIdMap } from '../storage';
import { Host, RequestHostRequestModel } from './entities';

const hostMap = HostMap;
const roomCodeToHostIdMap = RoomCodeToHostIdMap;

export class HostService {
  public static createHost(socket: Socket, req: RequestHostRequestModel): Host {
    const [id, roomCode] = HostService.generateSessionID();
    const host: Host = {
      id: id,
      roomCode: roomCode,
      files: req.files,
    };
    hostMap.set(id, host);
    roomCodeToHostIdMap.set(roomCode, id);

    return host;
  }

  public static destroyHost(socket: Socket, hostId: string): void {
    socket.leave(hostId);
    hostMap.delete(hostId);
    console.info(`Host destroyed: ${hostId}`);
  }

  private static generateSessionID(): [string, string] {
    let sessionId: string;
    let sessionCode: string;

    do {
      sessionId = uuidv4();
      sessionCode = randomstring.generate({
        length: 6,
        charset: 'numeric',
      });
    } while (hostMap.get(sessionCode));

    return [sessionId, sessionCode];
  }
}
