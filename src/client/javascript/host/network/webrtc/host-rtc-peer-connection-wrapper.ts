import { Constants } from '../../../../../server/constants';
import { BaseRtcPeerConnectionWrapper } from '../../../webrtc-base/base-rtc-peer-connection-wrapper';
import { Message, MessageType } from '../../../webrtc-base/models/message';
import MESSAGE = Constants.MESSAGE;
import READY = Constants.READY;

export class HostRtcPeerConnectionWrapper extends BaseRtcPeerConnectionWrapper {

  private isNegotiating = false;
  private dataChannel: RTCDataChannel;
  private resolve;

  public initDataChannel(): Promise<RTCDataChannel> {
    this.peer.onnegotiationneeded = this.onNegotiationNeeded;
    this.peer.onsignalingstatechange = this.onSignalingStateChange;
    this.dataChannel = this.peer.createDataChannel(this.id);
    this.dataChannel.onmessage = this.onDataChannelReady;
    this.socket.on(MESSAGE, this.onMessage);

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private onNegotiationNeeded = () => {
    console.log('Negotiation');

    this.isNegotiating = true;
    this.createOffer();
  };

  private onSignalingStateChange = () => {
    console.log('Signaling state changed: ' + this.peer.signalingState);
  };

  private onDataChannelReady = (message: MessageEvent) => {
    if (message.data === READY) {
      console.log('Data channel ready');

      this.resolve(this.dataChannel);
    }
  };

  public onMessage = (message: Message) => {
    if (message.type === MessageType.Signal && message.senderId == this.id) {
      this.handleMessage(message);
    }
  };

}
