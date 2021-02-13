import {Socket} from "socket.io";
import {BaseRTCPeerConnectionWrapper} from "./baseRTCPeerConnectionWrapper";

export class BaseManager {

    protected peerList: BaseRTCPeerConnectionWrapper[];

    constructor(protected socket: Socket) {
        this.peerList = []
    }
}
