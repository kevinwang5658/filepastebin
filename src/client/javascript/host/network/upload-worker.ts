import { Socket } from 'socket.io-client';
import { Constants } from '../../constants';
import { RtcFileSender } from './webrtc/rtc-file-sender';
import { SocketFileSender } from './webrtc/socket-file-sender';
import { BaseFileSender } from '../../webrtc-base/base-file-sender';
import RTC_INIT_TIMEOUT = Constants.RTC_INIT_TIMEOUT;

export class UploadWorker {

  private fileSender: BaseFileSender;
  private progress = 0;

  constructor(private id: string, private socket: Socket, private file: Blob, private progressChangedListener: (progress) => void) {
    this.init();
  }

  private async init() {
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

  private onOpen = (fileSender: BaseFileSender) => {
    console.log(`onopen: ${this.id}`);
    this.fileSender = fileSender;
    this.fileSender.onProgressChanged = this.onProgressChanged;
    this.fileSender.sendFiles();
  };

  private onRTCClose = () => {
    console.log('onclosed');
    this.fileSender = new SocketFileSender(this.file, this.socket, this.id);
    this.fileSender.sendFiles(this.progress);
  };

  private onProgressChanged = (progress: number) => {
    this.progress = progress;
    console.log(progress);
    this.progressChangedListener(progress);
  };
}
