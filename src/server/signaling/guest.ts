import { Socket } from "socket.io";
import { Constants } from "../../shared/constants";
import { Logger } from "../config/logger";
import { RoomState } from "./room-state";
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

const logger = Logger;

export class Guest {

  private state: RoomState;

  constructor(
    private socket: Socket,
    private io: SocketIO.Server,
    private roomsMap: Map<string, RoomState>,
    private roomId: string) {
  }

  public joinRoomAsGuest() {
    if (!this.roomsMap.get(this.roomId)) {
      this.socket.emit('exception', 'host disconnected');
      return;
    }

    this.state = this.roomsMap.get(this.roomId);
    this.socket.join(this.roomId);
    this.socket.emit(REQUEST_CLIENT_ACCEPTED, <RequestClientAcceptedModel>{
      roomId: this.roomId,
      files: this.state.files
    });

    logger.info(`Client connected: ${this.roomId}`)
  }

}
