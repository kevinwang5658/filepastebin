import { SignalingSocket } from '../../signaling/signaling-socket';
import { RtcFileSender } from './webrtc/rtc-file-sender';
import { BaseFileSender } from '../../webrtc-base/base-file-sender';

export class UploadWorker {

  private fileSender: BaseFileSender;
  public progress = 0;
  public fileSize = 0;

  constructor(
    private id: string,
    private socket: SignalingSocket,
    private file: Blob,
    private progressChangedListener: () => void,
  ) {
    this.fileSize = file.size;
    this.init();
  }

  private async init(): Promise<void> {
    const rtcFileSender = new RtcFileSender(this.id, this.file, this.socket);
    const dataChannel = await rtcFileSender.initDataChannel();

    console.log('dataChannel is open in uploadWorker');
    dataChannel.onclose = this.onRTCClose;
    this.onOpen(rtcFileSender);
  }

  private onOpen = (fileSender: BaseFileSender): void => {
    console.log(`onopen: ${this.id}`);
    this.fileSender = fileSender;
    this.fileSender.onProgressChanged = this.onProgressChanged;
    this.fileSender.sendFiles();
  };

  private onRTCClose = (): void => {
    console.log('WebRTC channel closed');
  };

  private onProgressChanged = (progress: number): void => {
    this.progress = progress;
    this.progressChangedListener();
  };
}
