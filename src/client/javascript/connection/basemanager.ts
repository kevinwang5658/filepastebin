import {Socket} from "socket.io";
import {BasePeer} from "./basepeer";

export class BaseManager {

    protected peerList: BasePeer[];

    constructor(protected socket: Socket) {
        this.peerList = []
    }
}