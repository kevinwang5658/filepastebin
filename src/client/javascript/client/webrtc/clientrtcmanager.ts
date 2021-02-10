import {Constants} from "../../../../shared/constants";
import {ClientPeer} from "./clientpeer";
import {Message} from "../../webrtc-base/models/message";
import Socket = SocketIOClient.Socket;

declare var download: any;

export class ClientRTCManager {

    private workers = new Map<string, ClientPeer>();
    private files: Constants.FileDescription[];

    constructor(private socket: Socket, files: Constants.FileDescription[]) {
        this.files = files;
    }

    public initializeWorkers = () => {
        for (const file of this.files) {
            let id = file.fileName;

            this.workers.set(
                id,
                new ClientPeer(
                    id,
                    this.socket,
                    file));
        }

        Promise.all([ ...this.workers.values() ].map((peer: ClientPeer) => peer.getCompleteListener()
                .then((value: ArrayBuffer[]) => {
                this.onDataLoaded(value, peer.file)
            })));

        [ ...this.workers.values() ].forEach((peer: ClientPeer) => peer.onprogresschanged = this.handleprogresschanged)
    };

    public handleMessage = (message: Message) => {
        this.workers.get(message.senderId).handleMessage(message);
    };

    public onprogresschanged: (number: number) => void = number => {};

    private handleprogresschanged = () => {
        let progress = [ ...this.workers.values() ]
            .map((peer: ClientPeer) => peer.progress)
            // .map((progress) => progress * (this.workerFileSize / this.fileSize) * 100)
            .reduce((previousValue, currentValue) => previousValue + currentValue);

        this.onprogresschanged(progress);
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
