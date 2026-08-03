import { SignalingSocket } from '../../signaling/signaling-socket';
import { UploadWorker } from './upload-worker';
import { Constants } from '../../constants';
import { FileRequest, Message, MessageAction, MessageType } from '../../webrtc-base/models/message';
import MESSAGE = Constants.MESSAGE;

export type HostProgressListener = (state: HostProgressState, uploadProgress: number) => void;

export enum HostProgressState {
  SOCKET_IO_WAITING_FOR_JOIN,
  SOCKET_IO_JOINED,
  WEBRTC_CONNECTING,
  WEBRTC_CONNECTED,
  FILES_SENDING,
  FILES_SENT
}

export class HostNetworkManager {

  private workers = new Map<string, UploadWorker>();
  private progressListeners: HostProgressListener[] = [];
  public state = HostProgressState.SOCKET_IO_WAITING_FOR_JOIN;

  constructor(private socket: SignalingSocket, private files: File[]) {
    socket.on('disconnect', (reason) => console.log('Signaling disconnected:', reason));
    socket.on('error', (err) => console.log('Signaling error:', err));
    socket.on(MESSAGE, this.onMessage);
    socket.on('client-joined', this.onNewClientJoined);
  }

  public addProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners.push(listener);
  };

  public removeProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners = this.progressListeners.filter(l => l !== listener);
  };

  private onMessage = (message: Message): void => {
    if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
      const request: FileRequest = message.content;
      const file = this.files.find((u) => u.name === request.fileName);
      this.workers.set(
        message.senderId,
        new UploadWorker(message.senderId, this.socket, file, this.uploadWorkerProgressChangedListener),
      );
    }
    this.updateStateBasedOnMessage(message);
  };

  private onNewClientJoined = (): void => {
    this.state = HostProgressState.WEBRTC_CONNECTING;
    this.callProgressStateListeners(HostProgressState.WEBRTC_CONNECTING, 0);
  };

  private updateStateBasedOnMessage(message: Message): void {
    switch (message.type) {
      case MessageType.Signal:
      case MessageType.Request:
        this.state = HostProgressState.WEBRTC_CONNECTING;
        this.callProgressStateListeners(HostProgressState.WEBRTC_CONNECTING, 0);
        break;
    }
  }

  private uploadWorkerProgressChangedListener = (): void => {
    const sizes = Array.from(this.workers, ([, w]) => w.fileSize);
    const totalFileSize = sizes.reduce((a, b) => a + b, 0);
    const progress = Array.from(this.workers, ([, w]) => w.progress / totalFileSize)
      .reduce((a, b) => a + b, 0);

    if (progress < 1) {
      this.state = HostProgressState.FILES_SENDING;
      this.callProgressStateListeners(HostProgressState.FILES_SENDING, progress);
    } else {
      this.state = HostProgressState.FILES_SENT;
      this.callProgressStateListeners(HostProgressState.FILES_SENT, 1);
    }
  };

  private callProgressStateListeners = (state: HostProgressState, downloadProgress: number): void => {
    this.progressListeners.forEach(listener => listener(state, downloadProgress));
  };
}
