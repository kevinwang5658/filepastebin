import {Constants} from "../../../shared/constants";
import {IFileSender} from "./models/ifilesender";
import {Message, MessageType} from "./models/message";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import EOF = Constants.EOF;
import Socket = SocketIOClient.Socket;

export class SocketFileSender implements IFileSender{

    public currentChunk = 0;
    private fileReader = new FileReader();

    constructor(private file: Blob, private socket: Socket, private senderId: string) {}

    public sendFiles = async (progress: number = 0) => {
        this.currentChunk = progress / BYTES_PER_CHUNK;

        console.log(`id: ${this.senderId} fileSize: ${this.file.size}`);

        while (this.currentChunk * BYTES_PER_CHUNK < this.file.size) {
            let start = BYTES_PER_CHUNK * this.currentChunk;
            let end = Math.min(this.file.size, start + BYTES_PER_CHUNK);

            await this.readAsArrayBuffer(this.file.slice(start, end));
            this.socket.send(new Message(this.senderId, MessageType.Data, null, this.fileReader.result));

            this.currentChunk++;
            this.onprogresschanged(this.currentChunk * BYTES_PER_CHUNK);
        }

        this.socket.send(new Message(this.senderId, MessageType.Data, null, EOF))
    };

    public onprogresschanged: (progress: number) => void = progress => {};

    private readAsArrayBuffer = (file: Blob) => {
        return new Promise((resolve, reject) => {
            this.fileReader.onload = () => resolve(this.fileReader.result);

            this.fileReader.onerror = reject;

            this.fileReader.readAsArrayBuffer(file)
        })
    };
}
