import {Constants} from "../../../shared/constants";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import {ClientRTCManager} from "./webrtc/clientrtcmanager";
import {Message} from "../webrtc-base/models/message";
import MESSAGE = Constants.MESSAGE;
import Socket = SocketIOClient.Socket;

export class ClientSocketManager {

    private rtcManager: ClientRTCManager;

    constructor(private socket: Socket,
                private roomId: string) {
        socket.on(REQUEST_CLIENT_ACCEPTED, this.requestClientAccepted);
        socket.on(MESSAGE, this.onmessage);

        this.requestClient()
    }

    requestDownload = () => {
        if (this.rtcManager) {
            this.rtcManager.initializeWorkers()
        }
    };

    public onprogresschanged: (progress: number) => void = (progress) => {};

    private requestClient = () => {
        this.socket.emit(REQUEST_CLIENT, this.roomId)
    };

    private requestClientAccepted = (res: RequestClientAcceptedModel) => {
        this.rtcManager = new ClientRTCManager(this.socket, res.fileName, res.fileSize, res.fileType);
        this.rtcManager.onprogresschanged = this.handleProgressChanged;
    };

    private onmessage = (message: Message) => {
        this.rtcManager.handleMessage(message)
    };

    private handleProgressChanged = (progress: number) => {
        this.onprogresschanged(progress);
    }
}
