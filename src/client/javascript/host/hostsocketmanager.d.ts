import { Socket } from "socket.io";
import { Constants } from "../../../shared/constants";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
export declare class HostSocketManager {
    private socket;
    private file;
    hostacceptedcallback: (response: RequestHostAcceptedModel) => void;
    private peerManager;
    constructor(socket: Socket, file: File);
    requestHost: () => void;
    private onhost;
    private onmessage;
}
