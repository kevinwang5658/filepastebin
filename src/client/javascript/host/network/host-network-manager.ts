import { Socket } from 'socket.io-client';
import { Constants } from '../../constants';
import { FileRequest, Message, MessageAction, MessageType } from '../../webrtc-base/models/message';
import { UploadWorker } from './upload-worker';
import DISCONNECT = Constants.DISCONNECT;
import ERROR = Constants.ERROR;
import FileDescription = Constants.FileDescription;
import MESSAGE = Constants.MESSAGE;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import NEW_CLIENT_JOINED = Constants.NEW_CLIENT_JOINED;

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

  //Override outside to listen
  public onRoomCreatedCallback: (response: RequestHostAcceptedModel, hostNetworkManager: HostNetworkManager) => void;

  constructor(private socket: Socket, private files: File[]) {
    socket.on(DISCONNECT, (reason) => console.log(reason));
    socket.on(ERROR, (err) => console.log(err));
    socket.on(MESSAGE, this.onMessage);
    socket.on(NEW_CLIENT_JOINED, this.onNewClientJoined);

    this.createSocketIORoom(files);
  }

  public createSocketIORoom = (files: File[]) => {
    const fileDescriptions = files.map((u) => (<FileDescription>{
      fileName: u.name,
      fileSize: u.size,
      fileType: u.type,
    }));

    this.socket.emit(Constants.REQUEST_HOST, {
      files: fileDescriptions,
    }, this.onRoomCreated);
  };

  public addProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners.push(listener);
  };

  public removeProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners.filter((u) => u !== listener);
  };

  private onRoomCreated = (response: RequestHostAcceptedModel) => {
    this.onRoomCreatedCallback(response, this);
  };

  private onMessage = (message: Message): void => {
    if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
      const request: FileRequest = message.content;
      const file = this.files.find((u) => u.name === request.fileName);
      this.workers.set(message.senderId, new UploadWorker(message.senderId, this.socket, file, this.uploadWorkerProgressChangedListener));
    }
    console.log(JSON.stringify(message));
    this.updateStateBasedOnMessage(message);
  };

  private onNewClientJoined = (): void => {
    this.state = HostProgressState.WEBRTC_CONNECTING;
    this.callProgressStateListeners(HostProgressState.WEBRTC_CONNECTING, 0);
  };

  private updateStateBasedOnMessage(message: Message): void {
    switch (message.type) {
      case MessageType.Signal: case MessageType.Request:
        this.state = HostProgressState.WEBRTC_CONNECTING;
        return this.callProgressStateListeners(HostProgressState.WEBRTC_CONNECTING, 0);
      case MessageType.Data:
        this.state = HostProgressState.FILES_SENDING;
        return this.callProgressStateListeners(HostProgressState.FILES_SENDING, 0);
    }
  }

  private uploadWorkerProgressChangedListener = (): void => {
    const totalFileSize = Array.from(this.workers, ([, worker]) => worker.fileSize)
      .reduce((prev, curr) => prev + curr);
    const progress = Array.from(this.workers,
      ([, worker]) => worker.progress / totalFileSize)
      .reduce((prev, curr) => prev + curr);

    if (progress < 1) {
      this.state = HostProgressState.FILES_SENDING;
      this.callProgressStateListeners(HostProgressState.FILES_SENDING, progress);
    } else {
      this.state = HostProgressState.FILES_SENT;
      this.callProgressStateListeners(HostProgressState.FILES_SENT, 1);
    }
  };

  private callProgressStateListeners = (state: HostProgressState, downloadProgress: number): void => {
    this.progressListeners.forEach((listener) => {
      listener(state, downloadProgress);
    });
  };

}
