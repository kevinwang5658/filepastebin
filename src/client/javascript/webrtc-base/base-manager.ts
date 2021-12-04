import { Socket } from "socket.io";
import { BaseRtcPeerConnectionWrapper } from "./base-rtc-peer-connection-wrapper";

export class BaseManager {

  protected peerList: BaseRtcPeerConnectionWrapper[];

  constructor(protected socket: Socket) {
    this.peerList = []
  }
}
