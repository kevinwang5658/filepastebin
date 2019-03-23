import { IFileSender } from "./ifilesender";
export declare class RtcFileSender implements IFileSender {
    private file;
    private dataChannel;
    currentChunk: number;
    private fileReader;
    constructor(file: Blob, dataChannel: RTCDataChannel);
    sendFiles: (progress?: number) => Promise<void>;
    onprogresschanged: (progress: number) => void;
    private readAsArrayBuffer;
    private bufferedAmountLow;
    private bufferAmountLowTimer;
}
