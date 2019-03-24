import {Constants} from "../../../shared/constants";
import {ClientPeer} from "./clientpeer";
import {Message} from "../connection/message";
import NUMBER_WORKERS = Constants.NUMBER_WORKERS;
import Socket = SocketIOClient.Socket;

declare var download: any;

export class ClientRTCManager {

    private workers = new Map<string, ClientPeer>();
    private workerFileSize: number;

    constructor(private socket: Socket, private fileName: string, private fileSize: number, private fileType: string) {
        this.workerFileSize = Math.ceil(fileSize / NUMBER_WORKERS);
    }

    public initializeWorkers = () => {
        let chunkStart = 0;
        while (chunkStart < this.fileSize) {
            let id = this.fileName + chunkStart;

            this.workers.set(
                id,
                new ClientPeer(
                    id,
                    this.socket,
                    this.fileName,
                    chunkStart,
                    Math.min(this.fileSize, chunkStart + this.workerFileSize),
                    this.workerFileSize));

            chunkStart += this.workerFileSize;
        }

        Promise.all([ ...this.workers.values() ].map((peer: ClientPeer) => peer.getCompleteListener()))
            .then((value: ArrayBuffer[][]) => {
                this.onDataLoaded(value)
            });

        [ ...this.workers.values() ].forEach((peer: ClientPeer) => peer.onprogresschanged = this.handleprogresschanged)
    };

    public handleMessage = (message: Message) => {
        this.workers.get(message.senderId).handleMessage(message);
    };

    public onprogresschanged: (number: number) => void = number => {};

    private handleprogresschanged = () => {
        let progress = [ ...this.workers.values() ]
            .map((peer: ClientPeer) => peer.progress)
            .map((progress) => progress * (this.workerFileSize / this.fileSize) * 100)
            .reduce((previousValue, currentValue) => previousValue + currentValue);

        this.onprogresschanged(progress);
    };

    private onDataLoaded = (value: ArrayBuffer[][]) => {
        download(
            new Blob([].concat(...value), {
                type: this.fileType
            }),
            this.fileName,
            this.fileType
        )
    }
}