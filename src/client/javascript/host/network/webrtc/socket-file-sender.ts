import { Socket } from 'socket.io-client';
import { Constants } from '../../../constants';
import { BaseFileSender } from '../../../webrtc-base/base-file-sender';
import { Message, MessageType } from '../../../webrtc-base/models/message';
import EOF = Constants.EOF;
import SOCKET_IO_BYTES_PER_CHUNK = Constants.SOCKET_IO_BYTES_PER_CHUNK;

export class SocketFileSender implements BaseFileSender {

  public currentChunk = 0;
  private fileReader = new FileReader();

  constructor(private file: Blob, private socket: Socket, private senderId: string) {
  }

  public sendFiles = async (progress = 0) => {
    this.currentChunk = progress / SOCKET_IO_BYTES_PER_CHUNK;

    console.log(`id: ${this.senderId} fileSize: ${this.file.size}`);

    while (this.currentChunk * SOCKET_IO_BYTES_PER_CHUNK < this.file.size) {
      const start = SOCKET_IO_BYTES_PER_CHUNK * this.currentChunk;
      const end = Math.min(this.file.size, start + SOCKET_IO_BYTES_PER_CHUNK);

      await this.readAsArrayBuffer(this.file.slice(start, end));
      this.socket.send(new Message(this.senderId, MessageType.Data, null, this.fileReader.result));

      this.currentChunk++;
      this.onProgressChanged(this.currentChunk * SOCKET_IO_BYTES_PER_CHUNK);
    }

    this.socket.send(new Message(this.senderId, MessageType.Data, null, EOF));
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
}
