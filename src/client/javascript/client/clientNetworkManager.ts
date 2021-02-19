import {Constants} from "../../../shared/constants";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import {Message} from "../webrtc-base/models/message";
import MESSAGE = Constants.MESSAGE;
import Socket = SocketIOClient.Socket;
import {fileRequester} from "./webrtc/fileRequester";

declare var download: any;

export class ClientNetworkManager {

    public onProgressChangedCallback: (progress: number[]) => void = (progress) => {};

    private workers = new Map<string, fileRequester>();
    private files: Constants.FileDescription[];

    constructor(private socket: Socket,
                private roomId: string) {
        socket.on(REQUEST_CLIENT_ACCEPTED, this.onRoomJoined);
        socket.on(MESSAGE, this.onMessage);

        this.joinSocketIORoom()
    }

    public requestDownload = () => {
        for (const file of this.files) {
            let id = file.fileName;

            this.workers.set(
                id,
                new fileRequester(
                    id,
                    this.socket,
                    file));
        }

        Promise.all([ ...this.workers.values() ].map((peer: fileRequester) => peer.getCompleteListener()
            .then((value: ArrayBuffer[]) => {
                this.onDataLoaded(value, peer.file)
            })));

        [ ...this.workers.values() ].forEach((peer: fileRequester) => peer.onProgressChangedCallback = this.handleprogresschanged)
    };

    private joinSocketIORoom = () => {
        this.socket.emit(REQUEST_CLIENT, this.roomId)
    };

    private onRoomJoined = (res: RequestClientAcceptedModel) => {
        this.files = res.files
    };

    private onMessage = (message: Message) => {
        this.workers.get(message.senderId).handleMessage(message);
    };

    private handleprogresschanged = () => {
        let progress = [ ...this.workers.values() ]
            .map((peer: fileRequester) => peer.progress)
            .map((progress) => progress * 100)


        this.onProgressChangedCallback(progress);
    };

    private onDataLoaded = (value: ArrayBuffer[], file: Constants.FileDescription) => {
        download(
            new Blob(value, {
                type: file.fileType
            }),
            file.fileName,
            file.fileSize
        )
    }
}
