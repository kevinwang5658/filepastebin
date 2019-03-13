import {Socket} from "socket.io";
import {Message, MessageAction, MessageType} from "./message";

export class BasePeer {

    protected peer: RTCPeerConnection;

    constructor(protected id: string, protected socket: Socket) {
        this.peer = new RTCPeerConnection();
    }

    createOffer = () => this.peer.createOffer()
        .then((desc) => {
            return this.peer.setLocalDescription(desc)
        }).then((desc)=> {
            this.sendOffer(this.peer.localDescription.toJSON())
        }).catch((err) => console.error(err));

    createAnswer = () => this.peer.createAnswer()
        .then((desc) => {
            return this.peer.setLocalDescription(desc);
        }).then((desc) => {
            this.sendAnswer(this.peer.localDescription.toJSON())
        }).catch((err) => console.error(err));

    sendOffer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Offer, content));

    sendAnswer = (content: string) => this.socket.send(new Message(this.id, MessageType.Signal, MessageAction.Answer, content));
}