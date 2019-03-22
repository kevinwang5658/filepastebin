import { Socket } from "socket.io";
export declare class ClientSocketManager {
    private socket;
    private roomId;
    private rtcManager;
    constructor(socket: Socket, roomId: string);
    requestDownload: () => void;
    onprogresschanged: (progress: number) => void;
    private requestClient;
    private requestClientAccepted;
    private onmessage;
    private handleProgressChanged;
}
