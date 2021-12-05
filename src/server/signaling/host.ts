import * as randomstring from 'randomstring';
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Constants } from '../../shared/constants';
import { Logger } from "../config/logger";
import { RoomState } from "./room-state";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import RequestHostRequestModel = Constants.RequestHostRequestModel;

const logger = Logger;

export class Host {
  private state: RoomState;

  constructor(
    private socket: Socket,
    private io: SocketIO.Server,
    private roomsMap: Map<string, RoomState>,
    private roomCodeToRoomIdMap: Map<string, string>) {
  }

  public createHost(req: RequestHostRequestModel) {
    let [roomId, roomCode] = this.generateSessionID();
    this.state = {
      roomId: roomId,
      roomCode: roomCode,
      hostId: this.socket.id,
      files: req.files
    };
    this.roomsMap.set(roomId, this.state);
    this.roomCodeToRoomIdMap.set(roomCode, roomId)

    this.socket.join(roomId);
    this.socket.emit(Constants.REQUEST_HOST_ACCEPTED, <RequestHostAcceptedModel>{
      roomCode: roomCode,
      files: req.files
    });

    logger.info(`Host created: ${this.state.roomId}`);
  }

  public destroyHost() {
    this.socket.leave(this.state.roomId);
    this.roomsMap.delete(this.state.roomId);
    logger.info(`Host destroyed: ${this.state.roomId}`);
  }

  private generateSessionID(): [string, string] {
    let sessionId: string
    let sessionCode: string;

    do {
      sessionId = uuidv4()
      sessionCode = randomstring.generate({
        length: 6,
        charset: 'numeric'
      })
    } while (this.roomsMap.get(sessionCode));


    return [sessionId, sessionCode]
  }
}
