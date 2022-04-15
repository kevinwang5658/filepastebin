import { HostRtcPeerConnectionWrapper } from './host-rtc-peer-connection-wrapper';
import { Constants } from '../../../../../server/constants';
import { BaseFileSender } from '../../../webrtc-base/base-file-sender';
import EOF = Constants.EOF;
import MAX_BUFFER = Constants.MAX_BUFFER;
import Socket = SocketIOClient.Socket;


export class RtcFileSender implements BaseFileSender {
  public currentChunk = 0;
  private fileReader = new FileReader();
  private rtcWrapper: HostRtcPeerConnectionWrapper;
  private rtcPeerConnection = new RTCPeerConnection(Constants.PeerConfiguration);
  private dataChannel: RTCDataChannel;
  private bytesPerChunk = 0;


  constructor(private id: string, private file: Blob, socket: Socket) {
    this.rtcWrapper = new HostRtcPeerConnectionWrapper(this.rtcPeerConnection, id, socket);
  }

  public initDataChannel = async (): Promise<RTCDataChannel> => {
    return this.rtcWrapper.initDataChannel()
      .then((dataChannel) => {
        console.log('Configuring data channel');

        this.bytesPerChunk = 2000;
        dataChannel.bufferedAmountLowThreshold = this.bytesPerChunk;
        dataChannel.onerror = this.onRTCError;
        this.dataChannel = dataChannel;

        return dataChannel;
      });
  };

  public sendFiles = async (progress = 0): Promise<void> => {
    this.currentChunk = progress / this.bytesPerChunk;

    while (this.currentChunk * this.bytesPerChunk < this.file.size) {
      if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
        await this.bufferedAmountLow();
      }

      const start = this.bytesPerChunk * this.currentChunk;
      const end = Math.min(this.file.size, start + this.bytesPerChunk);

      console.log('Sending chunk: ' + start);

      await this.readAsArrayBuffer(this.file.slice(start, end));
      this.dataChannel.send(<ArrayBuffer> this.fileReader.result);

      this.currentChunk++;
      this.onProgressChanged(this.currentChunk * this.bytesPerChunk);
    }

    this.dataChannel.send(EOF);
  };

  public onProgressChanged: (progress: number) => void = (_) => {
  };

  private readAsArrayBuffer = (file: Blob) => {
    return new Promise((resolve, reject) => {
      this.fileReader.onload = () => resolve(this.fileReader.result);

      this.fileReader.onerror = reject;

      this.fileReader.readAsArrayBuffer(file);
    });
  };

  private bufferedAmountLow = () => {
    return new Promise((resolve, reject) => {
      try {
        this.bufferAmountLowTimer(resolve);
        this.dataChannel.addEventListener('bufferedamountlow', () => resolve(null), { once: true });
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  };

  private bufferAmountLowTimer = (resolve) => {
    setTimeout(() => {
      if (this.dataChannel.bufferedAmount > this.bytesPerChunk) {
        this.bufferedAmountLow();
      } else {
        resolve();
      }
    }, 1000);
  };

  private onRTCError = (err: Event) => console.log(`onerror${err}`);
}
