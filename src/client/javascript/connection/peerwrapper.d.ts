import { Socket } from "socket.io";
import { Message } from "./message";
export declare abstract class BasePeerWrapper {
    protected peer: RTCPeerConnection;
    protected id: string;
    protected socket: Socket;
    abstract initDataChannel(): Promise<RTCDataChannel>;
    constructor(peer: RTCPeerConnection, id: string, socket: Socket);
    handleMessage: (message: Message) => void;
    protected createOffer: () => Promise<void>;
    protected createAnswer: () => Promise<void>;
    protected sendOffer: (content: string) => Socket;
    protected sendAnswer: (content: string) => Socket;
    protected sendIceCandidate: (content: RTCIceCandidate) => Socket;
    private onicecandidateerror;
    private onicecandidate;
    private onconnectionstatechange;
}
export declare class HostPeerWrapper extends BasePeerWrapper {
    private isNegotiating;
    private dataChannel;
    private externalPromise;
    initDataChannel(): Promise<RTCDataChannel>;
    private onnegotiationneeded;
    private onsignalingstatechange;
    private ondatachannelready;
}
export declare class ClientPeerWrapper extends BasePeerWrapper {
    private dataChannel;
    private externalPromise;
    initDataChannel(): Promise<RTCDataChannel>;
    private ondatachannel;
    private ondatachannelready;
}
