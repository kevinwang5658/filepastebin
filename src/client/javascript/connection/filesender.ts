import {Constants} from "../../../shared/constants";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import MAX_BUFFER = Constants.MAX_BUFFER;

export class FileSender {
    private currentChunk = 0;
    private fileReader = new FileReader();

    constructor(private file: Blob, private dataChannel: RTCDataChannel) {
        this.dataChannel.bufferedAmountLowThreshold = BYTES_PER_CHUNK;
    }

    public sendFiles = async () => {
        while(this.currentChunk * BYTES_PER_CHUNK < this.file.size) {
            if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
                await this.bufferedAmountLow()
            }


            var start = BYTES_PER_CHUNK * this.currentChunk;
            var end = Math.min(this.file.size, start + BYTES_PER_CHUNK);

            await this.readAsArrayBuffer(this.file.slice(start, end));
            this.dataChannel.send(<ArrayBuffer> this.fileReader.result);

            this.currentChunk++;

        }

        this.dataChannel.send('eof');
    };

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