import { Constants } from '../../constants';
import { BaseRtcPeerConnectionWrapper } from '../../webrtc-base/base-rtc-peer-connection-wrapper';
import READY = Constants.READY;
import RTC_OPEN = Constants.RTC_OPEN;

export class ClientRtcPeerConnectionWrapper extends BaseRtcPeerConnectionWrapper {

  private dataChannel: RTCDataChannel;
  private resolve;

  initDataChannel(): Promise<RTCDataChannel> {
    this.peer.ondatachannel = this.onDataChannel;

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private onDataChannel = (event: RTCDataChannelEvent) => {
    this.dataChannel = event.channel;
    this.dataChannel.binaryType = 'arraybuffer';
    if (this.dataChannel.readyState === RTC_OPEN) {
      this.onDataChannelReady();
    } else {
      this.dataChannel.onopen = () => {
        this.onDataChannelReady();
      };
    }
  };

  private onDataChannelReady = () => {
    console.log('onDataChannelOpen');
    this.resolve(this.dataChannel);
    this.dataChannel.send(READY);
  };
}
