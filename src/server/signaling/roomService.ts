import * as randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';
import { RoomMap, RoomCodeToHostIdMap } from '../storage';
import { Host, RequestHostRequestModel } from './entities';

const roomMap = RoomMap;
const roomCodeToHostIdMap = RoomCodeToHostIdMap;

export class RoomService {
  public static createRoom(req: RequestHostRequestModel): Host {
    const [id, roomCode] = RoomService.generateSessionID();
    const host: Host = {
      id: id,
      roomCode: roomCode,
      files: req.files,
    };
    roomMap.set(id, host);
    roomCodeToHostIdMap.set(roomCode, id);

    return host;
  }

  public static destroyRoom(hostId: string): void {
    roomMap.delete(hostId);
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
    } while (roomMap.get(sessionCode));

    return [sessionId, sessionCode];
  }
}
