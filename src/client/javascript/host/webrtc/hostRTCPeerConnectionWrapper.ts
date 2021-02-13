import {PromiseWrapper} from "../../helpers/PromiseWrapper";
import {BaseRTCPeerConnectionWrapper} from "../../webrtc-base/baseRTCPeerConnectionWrapper";
import {Constants} from "../../../../shared/constants";
import READY = Constants.READY;

export class HostRTCPeerConnectionWrapper extends BaseRTCPeerConnectionWrapper {

    private isNegotiating = false;
    private dataChannel: RTCDataChannel;
    private externalPromise: PromiseWrapper<RTCDataChannel> = new PromiseWrapper();

    public initDataChannel(): Promise<RTCDataChannel> {
        this.peer.onnegotiationneeded = this.onnegotiationneeded;
        this.peer.onsignalingstatechange = this.onsignalingstatechange;
        this.dataChannel = this.peer.createDataChannel(this.id);
        this.dataChannel.onmessage = this.ondatachannelready;

        return this.externalPromise.promise;
    }

    private onnegotiationneeded = () => {
        console.log('Negotiation');

        if (this.isNegotiating) return;

        this.isNegotiating = true;
        this.createOffer();
    };

    private onsignalingstatechange = () => {
        console.log('Signaling state changed: ' + this.peer.signalingState);

        this.isNegotiating = (this.peer.signalingState !== 'stable');
    };

    private ondatachannelready = (message: MessageEvent) => {
        if (message.data === READY) {
            this.externalPromise.resolve(this.dataChannel)
        }
    };

}
