import {Constants} from "../../../shared/constants";
import {ClientPeer} from "./clientpeer";
import {Socket} from "socket.io";
import {Message, MessageType} from "../connection/message";
import NUMBER_WORKERS = Constants.NUMBER_WORKERS;

declare var download: any;

export class ClientRTCManager {

    private workers = new Map<string, ClientPeer>();
    private workerFileSize: number;

    constructor(private socket: Socket, private fileName: string, private fileSize: number, private fileType: string) {
        this.workerFileSize = Math.ceil(fileSize / NUMBER_WORKERS);
    }

    initializeWorkers = () => {
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
                    Math.min(this.fileSize, chunkStart + this.workerFileSize)));

            chunkStart += this.workerFileSize;
        }

        Promise.all([ ...this.workers.values() ].map((peer: ClientPeer) => peer.getCompleteListener()))
            .then((value: ArrayBuffer[][]) => {
                this.onDataLoaded(value)
            })
    };

    handleMessage = (message: Message) => {
        if (message.type === MessageType.Signal) {
            this.workers.get(message.senderId).handleMessage(message);
        }
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