import {Socket} from "socket.io";
import {Message, MessageAction, MessageType} from "./message";
import {Constants} from "../../../shared/constants";
import RTC_OPEN = Constants.RTC_OPEN;
import {ExternalPromise} from "./externalpromise";
import READY = Constants.READY;

export abstract class BasePeerWrapper {

    abstract initDataChannel(): Promise<RTCDataChannel>

    constructor(protected peer: RTCPeerConnection, protected id: string, protected socket: Socket) {
        this.peer.onconnectionstatechange = this.onconnectionstatechange;
        this.peer.onicecandidate = this.onicecandidate;
        this.peer.onicecandidateerror = this.onicecandidateerror;
    }

    public handleMessage = (message: Message) => {
        if (message.type !== MessageType.Signal) {
            return
        }

        console.log('Got: ' + JSON.stringify(message));

        switch (message.action) {
            case MessageAction.IceCandidate:
                this.peer
                    .addIceCandidate(new RTCIceCandidate(message.content))
                    .catch((err: Event) => console.error(err));

                break;
            case MessageAction.Offer:
                if (message.content !== null) {
                    this.peer
                        .setRemoteDescription(message.content)
                        .then(() => {
                            this.createAnswer();
                            console.log('Created Answer')
                        }).catch((err: Event) => console.error(err));

                }
                break;
            case MessageAction.Answer:
                if (message.content !== null) {
                    this.peer
                        .setRemoteDescription(message.content)
                        .then(() => {
                            console.log('Answer set')
                        }).catch((err: Event) => console.error(err));
                }
                break;
        }
    };

    //*****************************
    // Socket Messages
    //*****************************

    protected createOffer = () => this.peer.createOffer()
        .then((desc) => {
            return this.peer.setLocalDescription(desc)
        }).then((desc)=> {
            this.sendOffer(this.peer.localDescription.toJSON())
        }).catch((err) => console.error(err));

    protected createAnswer = () => this.peer.createAnswer()
        .then((desc) => {
            return this.peer.setLocalDescription(desc);
        }).then((desc) => {
            this.sendAnswer(this.peer.localDescription.toJSON())
        }).catch((err) => console.error(err));

    protected sendOffer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Offer, content));

    protected sendAnswer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Answer, content));

    protected sendIceCandidate = (content: RTCIceCandidate) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.IceCandidate, content));

    //***************************
    // RTC lifecycle
    //***************************

    private onicecandidateerror = (err: RTCPeerConnectionIceErrorEvent) => console.log('Ice candidate error: ' + JSON.stringify(err));

    private onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.hasOwnProperty('candidate')) {
            this.sendIceCandidate(event.candidate);
        }

        console.log('Ice Candidate: ' + JSON.stringify(event));
    };

    private onconnectionstatechange = () => console.log('Conenction state changed to: ' + this.peer.connectionState);

}


//***************************************
// Host Wrapper
//***************************************


export class HostPeerWrapper extends BasePeerWrapper {

    private isNegotiating = false;
    private dataChannel: RTCDataChannel;
    private externalPromise: ExternalPromise<RTCDataChannel> = new ExternalPromise();

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

//*************************************
// Client
//*************************************

export class ClientPeerWrapper extends BasePeerWrapper {

    private dataChannel: RTCDataChannel;
    private externalPromise: ExternalPromise<RTCDataChannel> = new ExternalPromise();

    initDataChannel(): Promise<RTCDataChannel> {
        this.peer.ondatachannel = this.ondatachannel;

        return this.externalPromise.promise
    }

    private ondatachannel = (event: RTCDataChannelEvent) => {
        this.dataChannel = event.channel;
        this.dataChannel.binaryType = 'arraybuffer';
        if (this.dataChannel.readyState === RTC_OPEN) {
            this.ondatachannelready()
        } else {
            this.dataChannel.onopen = () => {
                this.ondatachannelready()
            }
        }
    };

    private ondatachannelready = () => {
        this.externalPromise.resolve(this.dataChannel);
        this.dataChannel.send(READY);
    }
}