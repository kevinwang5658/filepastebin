import { Constants } from '../../constants';

export class FileRequester {
  public progress = 0;
  public onProgressChangedCallback: (n: number) => void = () => {};

  private receivedBytes = 0;
  private fileData: ArrayBuffer[] = [];
  private resolveOnComplete: ((data: ArrayBuffer[]) => void) | null = null;

  constructor(private totalSize: number, dataChannel: RTCDataChannel) {
    dataChannel.onmessage = ev => this.onMessage(ev.data);
  }

  public getCompleteListener(): Promise<ArrayBuffer[]> {
    return new Promise(resolve => { this.resolveOnComplete = resolve; });
  }

  private onMessage = (data: unknown) => {
    if (data === Constants.EOF) {
      this.progress = 1;
      this.onProgressChangedCallback(1);
      this.resolveOnComplete?.(this.fileData);
    } else {
      const buf = data as ArrayBuffer;
      this.fileData.push(buf);
      this.receivedBytes += buf.byteLength;
      this.progress = this.receivedBytes / this.totalSize;
      this.onProgressChangedCallback(this.progress);
    }
  };
}
