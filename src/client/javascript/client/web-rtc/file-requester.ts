import { ClientRtcPeerConnectionWrapper } from './client-rtc-peer-connection-wrapper';
import { Constants } from '../../../../server/constants';
import { FileRequest, Message, MessageAction, MessageType } from '../../webrtc-base/models/message';
import Socket = SocketIOClient.Socket;

export class FileRequester {

  public progress = 0;

  private rtcPeer: RTCPeerConnection;
  private rtcWrapper: ClientRtcPeerConnectionWrapper;
  private dataChannel: RTCDataChannel;
  private resolveOnComplete;
  private fileData: ArrayBuffer[] = [];

  constructor(public id: string, private socket: Socket, public file: Constants.FileDescription) {
    this.rtcPeer = new RTCPeerConnection(Constants.PeerConfiguration);
    this.rtcWrapper = new ClientRtcPeerConnectionWrapper(this.rtcPeer, id, socket);

    this.init();
  }

  public handleMessage = (message: Message) => {
    this.rtcWrapper.handleMessage(message);
    if (message.type === MessageType.Data) {
      this.onRTCMessage(message.content);
    }
  };

  public getCompleteListener() {
    return new Promise((resolve) => {
      this.resolveOnComplete = resolve;
    });
  }

  public onProgressChangedCallback: (number: number) => void = (_) => {
  };

  private requestFile = () => this.socket.send(
    new Message(
      this.id,
      MessageType.Request,
      MessageAction.CreatePeer,
      new FileRequest(this.file.fileName)),
  );

  private init = () => {
    this.rtcWrapper.initDataChannel()
      .then((dataChannel) => {
        console.log(`Promise return onOpen: ${this.id}`);

        this.dataChannel = dataChannel;
        this.dataChannel.onmessage = (ev: MessageEvent) => this.onRTCMessage(ev.data);
      });

    this.requestFile();
  };

  private onRTCMessage = (message: any) => {
    if (message !== 'eof') {
      this.fileData.push(message);
      this.progress = (this.fileData[0].byteLength || 0) * this.fileData.length
        / this.file.fileSize;
    } else {
      this.resolveOnComplete(this.fileData);
      this.progress = 1;

      if (this.dataChannel) {
        this.dataChannel.close();
        this.rtcPeer.close();
      }
    }

    this.onProgressChangedCallback(this.progress);
  };
}
