import * as randomstring from 'randomstring';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Base } from './base';
import { Constants } from '../constants';
import { HostModel } from './entities';

import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import RequestHostRequestModel = Constants.RequestHostRequestModel;

export class Host extends Base {

  private host: HostModel;

  constructor(
    socket: Socket,
    private io: SocketIO.Server,
    private hostMap: Map<string, HostModel>,
    private roomCodeToRoomIdMap: Map<string, string>) {
    super(socket);
  }

  public createHost(req: RequestHostRequestModel): void {
    const [roomId, roomCode] = this.generateSessionID();
    this.host = {
      roomId: roomId,
      roomCode: roomCode,
      hostId: this.socket.id,
      files: req.files,
    };
    this.hostMap.set(roomId, this.host);
    this.roomCodeToRoomIdMap.set(roomCode, roomId);

    this.socket.join(roomId);
    this.socket.emit(Constants.REQUEST_HOST_ACCEPTED, <RequestHostAcceptedModel>{
      roomCode: roomCode,
      files: req.files,
    });

    console.info(`Host created: ${this.host.roomId}`);
  }

  public destroyHost(): void {
    this.socket.leave(this.host.roomId);
    this.hostMap.delete(this.host.roomId);
    console.info(`Host destroyed: ${this.host.roomId}`);
  }

  private generateSessionID(): [string, string] {
    let sessionId: string;
    let sessionCode: string;

    do {
      sessionId = uuidv4();
      sessionCode = randomstring.generate({
        length: 6,
        charset: 'numeric',
      });
    } while (this.hostMap.get(sessionCode));


    return [sessionId, sessionCode];
  }
}
