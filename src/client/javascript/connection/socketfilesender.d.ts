import { Socket } from "socket.io";
import { IFileSender } from "./ifilesender";
export declare class SocketFileSender implements IFileSender {
    private file;
    private socket;
    private senderId;
    currentChunk: number;
    private fileReader;
    constructor(file: Blob, socket: Socket, senderId: string);
    sendFiles: (progress?: number) => Promise<void>;
    onprogresschanged: (progress: number) => void;
    private readAsArrayBuffer;
}
