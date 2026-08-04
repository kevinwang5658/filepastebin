import { Constants } from '../../../constants';
import MAX_BUFFER = Constants.MAX_BUFFER;
import EOF = Constants.EOF;

const CHUNK_SIZE = 16384;

export class RtcFileSender {
  private currentChunk = 0;

  public onProgressChanged: (bytesSent: number) => void = () => {};

  constructor(private file: Blob, private dataChannel: RTCDataChannel) {
    dataChannel.bufferedAmountLowThreshold = CHUNK_SIZE;
  }

  public sendFiles = async (resumeFrom = 0): Promise<void> => {
    this.currentChunk = Math.floor(resumeFrom / CHUNK_SIZE);

    while (this.currentChunk * CHUNK_SIZE < this.file.size) {
      if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
        await this.waitForBuffer();
      }

      const start = CHUNK_SIZE * this.currentChunk;
      const end = Math.min(this.file.size, start + CHUNK_SIZE);
      const buffer = await this.file.slice(start, end).arrayBuffer();
      this.dataChannel.send(buffer);

      this.currentChunk++;
      this.onProgressChanged(this.currentChunk * CHUNK_SIZE);
    }

    this.dataChannel.send(EOF);
  };

  private waitForBuffer = () => new Promise<void>((resolve) => {
    const check = () => {
      if (this.dataChannel.bufferedAmount <= CHUNK_SIZE) resolve();
      else setTimeout(check, 10);
    };
    this.dataChannel.addEventListener('bufferedamountlow', () => resolve(), { once: true });
    check();
  });
}
