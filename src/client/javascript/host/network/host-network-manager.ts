import { UploadWorker } from './upload-worker';
import { Constants } from '../../../../server/constants';
import { FileRequest, Message, MessageAction, MessageType } from '../../webrtc-base/models/message';
import DISCONNECT = Constants.DISCONNECT;
import ERROR = Constants.ERROR;
import FileDescription = Constants.FileDescription;
import MESSAGE = Constants.MESSAGE;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import Socket = SocketIOClient.Socket;

export class HostNetworkManager {

  private workers = new Map<string, UploadWorker>();

  //Override outside to listen
  public onRoomCreatedCallback: (response: RequestHostAcceptedModel) => void;

  constructor(private socket: Socket, private files: File[]) {
    socket.on(DISCONNECT, (reason) => console.log(reason));
    socket.on(ERROR, (err) => console.log(err));
    socket.on(REQUEST_HOST_ACCEPTED, this.onRoomCreated);
    socket.on(MESSAGE, this.onMessage);

    this.createSocketIORoom(files);
  }

  public createSocketIORoom = (files: File[]) => {
    const fileDescriptions = files.map((u) => (<FileDescription>{
      fileName: u.name,
      fileSize: u.size,
      fileType: u.type,
    }));

    console.log(fileDescriptions);

    this.socket.emit(Constants.REQUEST_HOST, {
      files: fileDescriptions,
    });
  };

  private onRoomCreated = (response: RequestHostAcceptedModel) => {
    this.onRoomCreatedCallback(response);
  };

  private onMessage = (message: Message) => {
    if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
      const request: FileRequest = message.content;

      const file = this.files.find((u) => u.name === request.fileName);

      this.workers.set(message.senderId, new UploadWorker(message.senderId, this.socket, file));
    }
  };

}
