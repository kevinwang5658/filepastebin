import { Socket } from 'socket.io-client';
import { RtcFileSender } from './webrtc/rtc-file-sender';
import { SocketFileSender } from './webrtc/socket-file-sender';
import { Constants } from '../../constants';
import { BaseFileSender } from '../../webrtc-base/base-file-sender';
import RTC_INIT_TIMEOUT = Constants.RTC_INIT_TIMEOUT;

export class UploadWorker {

  private fileSender: BaseFileSender;
  public progress = 0;
  public fileSize = 0;

  constructor(private id: string, private socket: Socket, private file: Blob, private progressChangedListener: () => void) {
    this.init();
    this.fileSize = file.size;
  }

  private async init(): Promise<void> {
    const rtcFileSender = new RtcFileSender(this.id, this.file, this.socket);
    Promise.race([
      rtcFileSender.initDataChannel()
        .then((dataChannel) => {
          console.log('dataChannel is open in uploadWorker');

          dataChannel.onclose = this.onRTCClose;
          return rtcFileSender;
        }),
      //fallback to socketIO
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(new SocketFileSender(this.file, this.socket, this.id));
        }, RTC_INIT_TIMEOUT);
      }),
    ]).then((fileSender: BaseFileSender) => {
      this.onOpen(fileSender);
    });
  }

  private onOpen = (fileSender: BaseFileSender): void => {
    console.log(`onopen: ${this.id}`);
    this.fileSender = fileSender;
    this.fileSender.onProgressChanged = this.onProgressChanged;
    this.fileSender.sendFiles();
  };

  private onRTCClose = (): void => {
    console.log('onclosed');
    this.fileSender = new SocketFileSender(this.file, this.socket, this.id);
    this.fileSender.sendFiles(this.progress);
  };

  private onProgressChanged = (progress: number): void => {
    this.progress = progress;
    this.progressChangedListener();
  };
}
