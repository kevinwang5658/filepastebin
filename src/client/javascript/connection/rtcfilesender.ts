import {Constants} from "../../../shared/constants";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import MAX_BUFFER = Constants.MAX_BUFFER;
import {IFileSender} from "./ifilesender";
import EOF = Constants.EOF;

export class RtcFileSender implements IFileSender{
    public currentChunk = 0;
    private fileReader = new FileReader();

    constructor(private file: Blob, private dataChannel: RTCDataChannel) {
        this.dataChannel.bufferedAmountLowThreshold = BYTES_PER_CHUNK;
    }

    public sendFiles = async (progress: number = 0) => {
        this.currentChunk = progress / BYTES_PER_CHUNK;

        while(this.currentChunk * BYTES_PER_CHUNK < this.file.size) {
            if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
                await this.bufferedAmountLow()
            }


            let start = BYTES_PER_CHUNK * this.currentChunk;
            let end = Math.min(this.file.size, start + BYTES_PER_CHUNK);

            await this.readAsArrayBuffer(this.file.slice(start, end));
            this.dataChannel.send(<ArrayBuffer> this.fileReader.result);

            this.currentChunk++;

            this.onprogresschanged(this.currentChunk * BYTES_PER_CHUNK);
        }

        this.dataChannel.send(EOF);
    };

    public onprogresschanged: (progress: number) => void = progress_ => {};

    private readAsArrayBuffer = (file: Blob) => {
        return new Promise((resolve, reject) => {
            this.fileReader.onload = () => resolve(this.fileReader.result);

            this.fileReader.onerror = reject;

            this.fileReader.readAsArrayBuffer(file)
        })
    };

    private bufferedAmountLow = () => {
        return new Promise((resolve, reject) => {
            try {
                this.bufferAmountLowTimer(resolve);
                this.dataChannel.addEventListener('bufferedamountlow', () => resolve(), {once: true});
            } catch(err) {
                console.log(err);
                reject();
            }
        })
    };

    private bufferAmountLowTimer = (resolve) => {
        setTimeout(() => {
            if (this.dataChannel.bufferedAmount > BYTES_PER_CHUNK) {
                this.bufferedAmountLow()
            }  else {
                resolve()
            }
        }, 1000);
    };
}