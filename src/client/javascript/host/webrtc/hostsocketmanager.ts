import {Constants} from "../../../../shared/constants";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import MESSAGE = Constants.MESSAGE;
import {Message} from "../../webrtc-base/models/message";
import DISCONNECT = Constants.DISCONNECT;
import ERROR = Constants.ERROR;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import {HostPeerManager} from "./hostpeermanager";
import Socket = SocketIOClient.Socket;

export class HostSocketManager {

    //Override outside to listen
    public hostacceptedcallback: (response: RequestHostAcceptedModel) => void;

    private peerManager: HostPeerManager;

    constructor(private socket: Socket, private files: Constants.File[]){
        socket.on(DISCONNECT, (reason) => console.log(reason));
        socket.on(ERROR, (err) => console.log(err));
        socket.on(REQUEST_HOST_ACCEPTED, this.onhost);
        socket.on(MESSAGE, this.onmessage);

        this.peerManager = new HostPeerManager(socket, files);
        this.requestHost(files);
    }

    public requestHost = (files: Constants.File[]) => {
        this.socket.emit(Constants.REQUEST_HOST, {
            files
        });
    };

    private onhost = (response: RequestHostAcceptedModel) => {
        this.hostacceptedcallback(response);
    };

    private onmessage = (message: Message) => {
        this.peerManager.handleMessage(message);
    }

}
