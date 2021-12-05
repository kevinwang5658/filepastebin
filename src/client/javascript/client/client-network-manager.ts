import { Constants } from "../../../shared/constants";
import RequestClientAcceptedModel = Constants.RequestClientAcceptedModel;
import REQUEST_CLIENT_ACCEPTED = Constants.REQUEST_CLIENT_ACCEPTED;
import { Message } from "../webrtc-base/models/message";
import MESSAGE = Constants.MESSAGE;
import Socket = SocketIOClient.Socket;
import { FileRequester } from "./web-rtc/file-requester";
import REQUEST_GUEST = Constants.REQUEST_GUEST;

declare var download: any;

export class ClientNetworkManager {

  public onProgressChangedCallback: (progress: number[]) => void = (_) => {
  };

  private workers = new Map<string, FileRequester>();
  private files: Constants.FileDescription[];

  constructor(private socket: Socket,
              private roomId: string) {
    socket.on(REQUEST_CLIENT_ACCEPTED, this.onRoomJoined);
    socket.on(MESSAGE, this.onMessage);

    this.joinSocketIORoom()
  }

  public requestDownload = () => {
    for (const file of this.files) {
      let id = file.fileName;

      this.workers.set(
        id,
        new FileRequester(
          id,
          this.socket,
          file));
    }

    Promise.all([...this.workers.values()].map((peer: FileRequester) => peer.getCompleteListener()
      .then((value: ArrayBuffer[]) => {
        this.onDataLoaded(value, peer.file)
      })));

    [...this.workers.values()].forEach((peer: FileRequester) => peer.onProgressChangedCallback = this.handleprogresschanged)
  };

  private joinSocketIORoom = () => {
    this.socket.emit(REQUEST_GUEST, this.roomId)
  };

  private onRoomJoined = (res: RequestClientAcceptedModel) => {
    this.files = res.files
  };

  private onMessage = (message: Message) => {
    this.workers.get(message.senderId).handleMessage(message);
  };

  private handleprogresschanged = () => {
    let progress = [...this.workers.values()]
      .map((peer: FileRequester) => peer.progress)
      .map((progress) => progress * 100)


    this.onProgressChangedCallback(progress);
  };

  private onDataLoaded = (value: ArrayBuffer[], file: Constants.FileDescription) => {
    download(
      new Blob(value, {
        type: file.fileType
      }),
      file.fileName,
      file.fileSize
    )
  }
}
