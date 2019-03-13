import {Socket} from "socket.io";
import {Constants} from "../../../shared/constants";
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import {ClientRTCManager} from "./clientrtcmanager";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

export class ClientSocketManager {

    private rtcManager: ClientRTCManager;

    constructor(private socket: Socket,
                private roomId: string) {
        socket.on(REQUEST_CLIENT_ACCEPTED, this.requestClientAccepted);

        this.requestClient()
    }

    requestDownload = () => {
        if (this.rtcManager) {
            this.rtcManager.initializeWorkers()
        }
    };

    private requestClient = () => {
        this.socket.emit(REQUEST_CLIENT, this.roomId)
    };

    private requestClientAccepted = (res: RequestClientAcceptedModel) => {
        this.rtcManager = new ClientRTCManager(this.socket, res.fileName, res.fileSize)
    }
}