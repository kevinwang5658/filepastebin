import {PromiseWrapper} from "../../../helpers/PromiseWrapper";
import {BaseRTCPeerConnectionWrapper} from "../../../webrtc-base/baseRTCPeerConnectionWrapper";
import {Constants} from "../../../../../shared/constants";
import READY = Constants.READY;
import {Message, MessageType} from "../../../webrtc-base/models/message";
import MESSAGE = Constants.MESSAGE;

export class HostRTCPeerConnectionWrapper extends BaseRTCPeerConnectionWrapper {

    private isNegotiating = false;
    private dataChannel: RTCDataChannel;
    private externalPromise: PromiseWrapper<RTCDataChannel> = new PromiseWrapper();

    public initDataChannel(): Promise<RTCDataChannel> {
        this.peer.onnegotiationneeded = this.onNegotiationNeeded;
        this.peer.onsignalingstatechange = this.onSignalingStateChange;
        this.dataChannel = this.peer.createDataChannel(this.id);
        this.dataChannel.onmessage = this.onDataChannelReady;
        this.socket.on(MESSAGE, this.onMessage);

        return this.externalPromise.promise;
    }

    private onNegotiationNeeded = () => {
        console.log('Negotiation');

        if (this.isNegotiating) return;

        this.isNegotiating = true;
        this.createOffer();
    };

    private onSignalingStateChange = () => {
        console.log('Signaling state changed: ' + this.peer.signalingState);

        this.isNegotiating = (this.peer.signalingState !== 'stable');
    };

    private onDataChannelReady = (message: MessageEvent) => {
        if (message.data === READY) {
            console.log('Data channel ready');

            this.externalPromise.resolve(this.dataChannel)
        }
    };

    public onMessage = (message: Message) => {
        if (message.type === MessageType.Signal && message.senderId == this.id) {
            this.handleMessage(message)
        }
    }

}
