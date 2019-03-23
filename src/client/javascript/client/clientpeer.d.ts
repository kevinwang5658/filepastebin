import { Socket } from "socket.io";
import { Message } from "../connection/message";
export declare class ClientPeer {
    id: string;
    private socket;
    private fileName;
    private chunkStart;
    private chunkEnd;
    private chunkSize;
    progress: number;
    private rtcPeer;
    private rtcWrapper;
    private dataChannel;
    private externalPromise;
    private fileData;
    constructor(id: string, socket: Socket, fileName: string, chunkStart: number, chunkEnd: number, chunkSize: number);
    handleMessage: (message: Message) => void;
    getCompleteListener(): Promise<ArrayBuffer[]>;
    onprogresschanged: (number: number) => void;
    private requestFileChunk;
    private init;
    private onmessage;
}
