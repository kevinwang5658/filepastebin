import { Socket } from "socket.io";
import { Message } from "../connection/message";
export declare class HostPeer {
    private id;
    private socket;
    private fileSlice;
    private rtcPeer;
    private rtcWrapper;
    private fileSender;
    private progress;
    constructor(id: string, socket: Socket, fileSlice: Blob);
    handleMessage: (message: Message) => void;
    private init;
    private onopen;
    private onrtcerror;
    private onrtcclose;
    private onprogresschanged;
}
