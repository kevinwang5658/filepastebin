import {Constants} from "../../../shared/constants";
import NUMBER_WORKERS = Constants.NUMBER_WORKERS;
import {ClientPeer} from "./clientpeer";
import {Socket} from "socket.io";

export class ClientRTCManager {

    private workers = new Map<string, ClientPeer>();
    private workerFileSize: number;

    constructor(private socket: Socket, private fileName: string, private fileSize: number) {
        this.workerFileSize = Math.ceil(fileSize / NUMBER_WORKERS);
    }

    initializeWorkers = () => {
        for (let counter = 0; counter < NUMBER_WORKERS; counter++) {
            let id = this.fileName + counter;

            this.workers.set(
                id,
                new ClientPeer(
                    id,
                    this.socket,
                    this.fileName,
                    this.workerFileSize * counter,
                    Math.min(this.fileSize, this.workerFileSize * (counter + 1))))
        }
    }
}