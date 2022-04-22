import { Socket } from 'socket.io-client';
import { Constants } from '../constants';
import { FileRequester } from './web-rtc/file-requester';
import { Message } from '../webrtc-base/models/message';
import MESSAGE = Constants.MESSAGE;
import REQUEST_CLIENT = Constants.REQUEST_CLIENT;
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;

declare let download: any;

export class ClientNetworkManager {

  public onProgressChangedCallback: (progress: number[]) => void = (_) => {
  };

  private workers = new Map<string, FileRequester>();
  private files: Constants.FileDescription[];

  constructor(private socket: Socket,
    private roomId: string) {
    socket.on(MESSAGE, this.onMessage);

    this.joinSocketIORoom();
  }

  public requestDownload = () => {
    for (const file of this.files) {
      const id = file.fileName;

      this.workers.set(
        id,
        new FileRequester(
          id,
          this.socket,
          file));
    }

    Promise.all([...this.workers.values()].map((peer: FileRequester) => peer.getCompleteListener()
      .then((value: ArrayBuffer[]) => {
        this.onDataLoaded(value, peer.file);
      })));

    [...this.workers.values()].forEach((peer: FileRequester) => peer.onProgressChangedCallback = this.handleprogresschanged);
  };

  private joinSocketIORoom = () => {
    this.socket.emit(REQUEST_CLIENT, this.roomId, this.onRoomJoined);
  };

  private onRoomJoined = (res: RequestClientAcceptedModel) => {
    this.files = res.files;
  };

  private onMessage = (message: Message) => {
    this.workers.get(message.senderId).handleMessage(message);
  };

  private handleprogresschanged = () => {
    const progress = [...this.workers.values()]
      .map((peer: FileRequester) => peer.progress)
      .map((progress) => progress * 100);


    this.onProgressChangedCallback(progress);
  };

  private onDataLoaded = (value: ArrayBuffer[], file: Constants.FileDescription) => {
    download(
      new Blob(value, {
        type: file.fileType,
      }),
      file.fileName,
      file.fileSize,
    );
  };
}
