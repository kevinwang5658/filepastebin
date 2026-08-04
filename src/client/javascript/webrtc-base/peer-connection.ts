import { SignalingSocket } from '../signaling/signaling-socket';
import { Message, MessageAction, MessageType } from './models/message';
import { Constants } from '../constants';

const TRANSFER_ID = '__transfer__';

class PeerConnection {
  protected peer: RTCPeerConnection;
  public onFailed: () => void = () => {};

  constructor(protected socket: SignalingSocket) {
    this.peer = new RTCPeerConnection(Constants.PeerConfiguration);
    this.peer.onicecandidate = ev => {
      socket.send(new Message(TRANSFER_ID, MessageType.Signal, MessageAction.IceCandidate, ev.candidate));
    };
    this.peer.onconnectionstatechange = () => {
      const s = this.peer.connectionState;
      if (s === 'failed' || s === 'closed') this.onFailed();
    };
    socket.on(Constants.MESSAGE, this.handleSignal);
  }

  public destroy(): void {
    this.socket.off(Constants.MESSAGE, this.handleSignal);
    this.peer.close();
  }

  private handleSignal = (raw: unknown) => {
    const msg = raw as Message;
    if (msg.type !== MessageType.Signal || msg.senderId !== TRANSFER_ID) return;
    switch (msg.action) {
      case MessageAction.IceCandidate:
        if (msg.content) {
          this.peer.addIceCandidate(new RTCIceCandidate(msg.content as RTCIceCandidateInit)).catch(console.error);
        }
        break;
      case MessageAction.Offer:
        this.peer.setRemoteDescription(msg.content as RTCSessionDescriptionInit)
          .then(() => this.peer.createAnswer())
          .then(answer => this.peer.setLocalDescription(answer))
          .then(() => this.socket.send(new Message(
            TRANSFER_ID, MessageType.Signal, MessageAction.Answer,
            this.peer.localDescription!.toJSON(),
          )))
          .catch(console.error);
        break;
      case MessageAction.Answer:
        if (this.peer.signalingState === 'have-local-offer') {
          this.peer.setRemoteDescription(msg.content as RTCSessionDescriptionInit).catch(console.error);
        }
        break;
    }
  };
}

export class HostPeerConnection extends PeerConnection {
  // Creates a data channel, negotiates, and resolves once the receiver sends READY.
  public open(): Promise<RTCDataChannel> {
    const ch = this.peer.createDataChannel('transfer', { ordered: true });
    const ready = new Promise<void>(resolve => {
      ch.onmessage = ev => { if (ev.data === Constants.READY) resolve(); };
    });
    this.peer.onnegotiationneeded = async () => {
      if (this.peer.signalingState !== 'stable') return;
      try {
        const offer = await this.peer.createOffer();
        if (this.peer.signalingState !== 'stable') return;
        await this.peer.setLocalDescription(offer);
        this.socket.send(new Message(
          TRANSFER_ID, MessageType.Signal, MessageAction.Offer,
          this.peer.localDescription!.toJSON(),
        ));
      } catch (err) {
        console.error('HostPeerConnection offer failed:', err);
      }
    };
    return ready.then(() => ch);
  }
}

export class ClientPeerConnection extends PeerConnection {
  // Registers ondatachannel and resolves when the channel opens.
  // Does NOT send READY — caller does that to control when sending starts.
  public accept(): Promise<RTCDataChannel> {
    return new Promise(resolve => {
      this.peer.ondatachannel = ev => {
        const ch = ev.channel;
        ch.binaryType = 'arraybuffer';
        if (ch.readyState === 'open') resolve(ch);
        else ch.onopen = () => resolve(ch);
      };
    });
  }
}
