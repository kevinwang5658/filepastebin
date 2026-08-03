import { SignalingSocket } from '../signaling/signaling-socket';
import { Constants } from '../constants';
import { FileRequester } from './web-rtc/file-requester';
import { ClientPeerConnection } from '../webrtc-base/peer-connection';

declare let download: (blob: Blob, name: string, size: number) => void;

export class ClientNetworkManager {

  public onProgressChangedCallback: (progress: number[]) => void = () => {};
  public onHostDisconnected: () => void = () => {};
  public onTransferFailed: () => void = () => {};

  private clientPeer: ClientPeerConnection;
  // Accept is called immediately so ondatachannel is registered before 'joined' is sent.
  private channelPromise: Promise<RTCDataChannel>;

  constructor(private socket: SignalingSocket, private files: Constants.FileDescription[]) {
    socket.on('host-disconnected', () => this.onHostDisconnected());

    this.clientPeer = new ClientPeerConnection(socket);
    this.clientPeer.onFailed = () => this.onTransferFailed();
    this.channelPromise = this.clientPeer.accept();

    socket.sendControl('joined');
  }

  public requestDownload = async (): Promise<void> => {
    const channel = await this.channelPromise;
    channel.send(Constants.READY);

    const totalSize = this.files.reduce((s, f) => s + f.fileSize, 0);
    const requester = new FileRequester(totalSize, channel);
    requester.onProgressChangedCallback = this.handleProgressChanged;
    const data = await requester.getCompleteListener();

    if (this.files.length === 1) {
      const f = this.files[0];
      download(new Blob(data, { type: f.fileType }), f.fileName, f.fileSize);
    } else {
      const blob = new Blob(data, { type: 'application/zip' });
      download(blob, 'files.zip', blob.size);
    }
  };

  private handleProgressChanged = (progress: number) => {
    const allProgress = this.files.map(() => progress * 100);
    this.onProgressChangedCallback(allProgress);
  };
}
