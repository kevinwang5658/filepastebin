import {Socket} from "socket.io";
import {BasePeerWrapper} from "./peerwrapper";

export class BaseManager {

    protected peerList: BasePeerWrapper[];

    constructor(protected socket: Socket) {
        this.peerList = []
    }
}