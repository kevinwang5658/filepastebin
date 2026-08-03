import { RtcFileSender } from './webrtc/rtc-file-sender';

export class UploadWorker {
  public progress = 0;
  public fileSize: number;

  constructor(file: Blob, dataChannel: RTCDataChannel, progressListener: () => void) {
    this.fileSize = file.size;
    const sender = new RtcFileSender(file, dataChannel);
    sender.onProgressChanged = (bytesSent) => {
      this.progress = bytesSent;
      progressListener();
    };
    sender.sendFiles();
  }
}
