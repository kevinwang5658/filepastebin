import {Socket} from "socket.io";
import {Constants} from "../../../shared/constants";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import MESSAGE = Constants.MESSAGE;
import {Message} from "../connection/message";
import DISCONNECT = Constants.DISCONNECT;
import ERROR = Constants.ERROR;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import {HostPeerManager} from "./hostpeermanager";

export class HostSocketManager {

    //Override outside to listen
    public hostacceptedcallback: (response: RequestHostAcceptedModel) => void;

    private peerManager: HostPeerManager;

    constructor(private socket: Socket, private file: File){
        socket.on(DISCONNECT, (reason) => console.log(reason));
        socket.on(ERROR, (err) => console.log(err));
        socket.on(REQUEST_HOST_ACCEPTED, this.onhost);
        socket.on(MESSAGE, this.onmessage);

        this.peerManager = new HostPeerManager(socket, file);
        this.requestHost();
    }

    public requestHost = () => {
        this.socket.emit(Constants.REQUEST_HOST, <Constants.RequestHostRequestModel>{
            fileName: this.file.name,
            fileSize: this.file.size,
            fileType: this.file.type
        });
    };

    private onhost = (response: RequestHostAcceptedModel) => {
        this.hostacceptedcallback(response);
    };

    private onmessage = (message: Message) => {
        this.peerManager.handleMessage(message);
    }

}