import { Socket } from "socket.io";
import { BasePeerWrapper } from "./peerwrapper";
export declare class BaseManager {
    protected socket: Socket;
    protected peerList: BasePeerWrapper[];
    constructor(socket: Socket);
}
