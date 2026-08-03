import { SignalingSocket } from '../signaling/signaling-socket';
import { Constants } from '../constants';
import { FileRequester } from './web-rtc/file-requester';
import { Message } from '../webrtc-base/models/message';
import MESSAGE = Constants.MESSAGE;

declare let download: (blob: Blob, name: string, size: number) => void;

export class ClientNetworkManager {

  public onProgressChangedCallback: (progress: number[]) => void = (_) => {};
  public onHostDisconnected: () => void = () => {};

  private workers = new Map<string, FileRequester>();

  constructor(
    private socket: SignalingSocket,
    private files: Constants.FileDescription[],
  ) {
    socket.on(MESSAGE, this.onMessage);
    socket.on('host-disconnected', () => this.onHostDisconnected());

    // Notify the room that this client has joined (triggers client-joined on host)
    socket.sendControl('joined');
  }

  public requestDownload = async (): Promise<void> => {
    for (const file of this.files) {
      this.workers.set(file.fileName, new FileRequester(file.fileName, this.socket, file));
    }

    for (const worker of this.workers.values()) {
      worker.onProgressChangedCallback = this.handleProgressChanged;
      const data = await worker.getCompleteListener();
      this.onDataLoaded(data, worker.file);
    }
  };

  private onMessage = (message: Message) => {
    const worker = this.workers.get(message.senderId);
    if (worker) worker.handleMessage(message);
  };

  private handleProgressChanged = () => {
    const progress = [...this.workers.values()]
      .map(w => w.progress * 100);
    this.onProgressChangedCallback(progress);
  };

  private onDataLoaded = (data: ArrayBuffer[], file: Constants.FileDescription) => {
    download(
      new Blob(data, { type: file.fileType }),
      file.fileName,
      file.fileSize,
    );
  };
}
