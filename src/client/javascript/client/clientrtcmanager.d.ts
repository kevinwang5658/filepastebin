import { Socket } from "socket.io";
import { Message } from "../connection/message";
export declare class ClientRTCManager {
    private socket;
    private fileName;
    private fileSize;
    private fileType;
    private workers;
    private workerFileSize;
    constructor(socket: Socket, fileName: string, fileSize: number, fileType: string);
    initializeWorkers: () => void;
    handleMessage: (message: Message) => void;
    onprogresschanged: (number: number) => void;
    private handleprogresschanged;
    private onDataLoaded;
}
