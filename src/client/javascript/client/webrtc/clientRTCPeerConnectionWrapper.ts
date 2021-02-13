import {PromiseWrapper} from "../../helpers/PromiseWrapper";
import {Constants} from "../../../../shared/constants";
import READY = Constants.READY;
import RTC_OPEN = Constants.RTC_OPEN;
import {BaseRTCPeerConnectionWrapper} from "../../webrtc-base/baseRTCPeerConnectionWrapper";

export class ClientRTCPeerConnectionWrapper extends BaseRTCPeerConnectionWrapper {

    private dataChannel: RTCDataChannel;
    private externalPromise: PromiseWrapper<RTCDataChannel> = new PromiseWrapper();

    initDataChannel(): Promise<RTCDataChannel> {
        this.peer.ondatachannel = this.onDataChannel;

        return this.externalPromise.promise
    }

    private onDataChannel = (event: RTCDataChannelEvent) => {
        this.dataChannel = event.channel;
        this.dataChannel.binaryType = 'arraybuffer';
        if (this.dataChannel.readyState === RTC_OPEN) {
            this.onDataChannelReady()
        } else {
            this.dataChannel.onopen = () => {
                this.onDataChannelReady()
            }
        }
    };

    private onDataChannelReady = () => {
        console.log('onDataChannelOpen')
        this.externalPromise.resolve(this.dataChannel);
        this.dataChannel.send(READY);
    }
}
