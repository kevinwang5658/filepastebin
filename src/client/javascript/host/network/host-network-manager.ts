import { zip } from 'fflate';
import { SignalingSocket } from '../../signaling/signaling-socket';
import { UploadWorker } from './upload-worker';
import { HostPeerConnection } from '../../webrtc-base/peer-connection';

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

  private currentWorker: UploadWorker | null = null;
  private progressListeners: HostProgressListener[] = [];
  public state = HostProgressState.SOCKET_IO_WAITING_FOR_JOIN;

  constructor(private socket: SignalingSocket, private files: File[], private iceServers: RTCIceServer[] = []) {
    socket.on('disconnect', reason => console.log('Signaling disconnected:', reason));
    socket.on('error', err => console.log('Signaling error:', err));
    socket.on('client-joined', this.onNewClientJoined);
  }

  public addProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners.push(listener);
  };

  public removeProgressListener = (listener: HostProgressListener): void => {
    this.progressListeners = this.progressListeners.filter(l => l !== listener);
  };

  private onNewClientJoined = async (): Promise<void> => {
    this.state = HostProgressState.WEBRTC_CONNECTING;
    this.callProgressStateListeners(HostProgressState.WEBRTC_CONNECTING, 0);

    const blob = this.files.length === 1
      ? this.files[0]
      : await this.zipFiles(this.files);

    const peer = new HostPeerConnection(this.socket, this.iceServers);
    peer.onFailed = () => {
      this.currentWorker = null;
      this.callProgressStateListeners(HostProgressState.SOCKET_IO_WAITING_FOR_JOIN, 0);
    };

    const ch = await peer.open();
    this.currentWorker = new UploadWorker(blob, ch, this.onWorkerProgress);
  };

  private zipFiles = (files: File[]): Promise<Blob> => {
    const input: Record<string, Uint8Array> = {};
    const reads = files.map(async f => {
      input[f.name] = new Uint8Array(await f.arrayBuffer());
    });
    return Promise.all(reads).then(() => new Promise((resolve, reject) => {
      zip(input, { level: 0 }, (err, data) => {
        if (err) reject(err);
        else resolve(new Blob([data], { type: 'application/zip' }));
      });
    }));
  };

  private onWorkerProgress = (): void => {
    if (!this.currentWorker) return;
    const progress = this.currentWorker.progress / this.currentWorker.fileSize;

    if (progress < 1) {
      this.state = HostProgressState.FILES_SENDING;
      this.callProgressStateListeners(HostProgressState.FILES_SENDING, progress);
    } else {
      this.state = HostProgressState.FILES_SENT;
      this.callProgressStateListeners(HostProgressState.FILES_SENT, 1);
    }
  };

  private callProgressStateListeners = (state: HostProgressState, uploadProgress: number): void => {
    this.progressListeners.forEach(l => l(state, uploadProgress));
  };
}
