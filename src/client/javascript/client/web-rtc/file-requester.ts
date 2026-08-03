import { SignalingSocket } from '../../signaling/signaling-socket';
import { Constants } from '../../constants';
import { ClientRtcPeerConnectionWrapper } from './client-rtc-peer-connection-wrapper';
import { FileRequest, Message, MessageAction, MessageType } from '../../webrtc-base/models/message';

export class FileRequester {

  public progress = 0;

  private rtcPeer: RTCPeerConnection;
  private rtcWrapper: ClientRtcPeerConnectionWrapper;
  private dataChannel: RTCDataChannel;
  private resolveOnComplete: (data: ArrayBuffer[]) => void;
  private fileData: ArrayBuffer[] = [];

  constructor(public id: string, private socket: SignalingSocket, public file: Constants.FileDescription) {
    this.rtcPeer = new RTCPeerConnection(Constants.PeerConfiguration);
    this.rtcWrapper = new ClientRtcPeerConnectionWrapper(this.rtcPeer, id, socket);

    this.init();
  }

  public handleMessage = (message: Message) => {
    this.rtcWrapper.handleMessage(message);
  };

  public getCompleteListener(): Promise<ArrayBuffer[]> {
    return new Promise((resolve) => {
      this.resolveOnComplete = resolve;
    });
  }

  public onProgressChangedCallback: (n: number) => void = (_) => {};

  private requestFile = () => this.socket.send(
    new Message(
      this.id,
      MessageType.Request,
      MessageAction.CreatePeer,
      new FileRequest(this.file.fileName),
    ),
  );

  private init = () => {
    this.rtcWrapper.initDataChannel()
      .then((dataChannel) => {
        console.log(`DataChannel open: ${this.id}`);
        this.dataChannel = dataChannel;
        this.dataChannel.onmessage = (ev: MessageEvent) => this.onRTCMessage(ev.data);
      });

    this.requestFile();
  };

  private onRTCMessage = (message: unknown) => {
    if (message !== 'eof') {
      this.fileData.push(message as ArrayBuffer);
      this.progress = (this.fileData[0]?.byteLength ?? 0) * this.fileData.length / this.file.fileSize;
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
