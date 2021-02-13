import {Constants} from "../../../../../shared/constants";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import MAX_BUFFER = Constants.MAX_BUFFER;
import {BaseFileSender} from "../../../webrtc-base/baseFileSender";
import EOF = Constants.EOF;
import {HostRTCPeerConnectionWrapper} from "./hostRTCPeerConnectionWrapper";
import Socket = SocketIOClient.Socket;

export class RtcFileSender implements BaseFileSender {
    public currentChunk = 0;
    private fileReader = new FileReader();
    private rtcWrapper: HostRTCPeerConnectionWrapper
    private dataChannel: RTCDataChannel

    constructor(private id: string, private file: Blob, socket: Socket) {
        const rtcPeerConnection = new RTCPeerConnection(Constants.PeerConfiguration);
        this.rtcWrapper = new HostRTCPeerConnectionWrapper(rtcPeerConnection, id, socket);
    }

    public initDataChannel = async () => {
        return this.rtcWrapper.initDataChannel()
            .then((dataChannel) => {
                console.log("Configuring data channel");

                dataChannel.bufferedAmountLowThreshold = BYTES_PER_CHUNK
                dataChannel.onerror = this.onRTCError;
                this.dataChannel = dataChannel

                return dataChannel;
            })
    }

    public sendFiles = async (progress: number = 0) => {
        this.currentChunk = progress / BYTES_PER_CHUNK;

        while(this.currentChunk * BYTES_PER_CHUNK < this.file.size) {
            if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
                await this.bufferedAmountLow()
            }

            let start = BYTES_PER_CHUNK * this.currentChunk;
            let end = Math.min(this.file.size, start + BYTES_PER_CHUNK);

            console.log("Sending chunk: " + start);

            await this.readAsArrayBuffer(this.file.slice(start, end));
            this.dataChannel.send(<ArrayBuffer> this.fileReader.result);

            this.currentChunk++;

            this.onProgressChanged(this.currentChunk * BYTES_PER_CHUNK);
        }

        this.dataChannel.send(EOF);
    };

    public onProgressChanged: (progress: number) => void = progress_ => {};

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
                this.dataChannel.addEventListener('bufferedamountlow', () => resolve(null), {once: true});
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

    private onRTCError = (err: Event) => console.log(`onerror${err}`);
}
