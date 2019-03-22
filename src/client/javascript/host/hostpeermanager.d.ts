import { Message } from "../connection/message";
import { Socket } from "socket.io";
export declare class HostPeerManager {
    private socket;
    private file;
    private workers;
    constructor(socket: Socket, file: File);
    handleMessage: (message: Message) => void;
}
