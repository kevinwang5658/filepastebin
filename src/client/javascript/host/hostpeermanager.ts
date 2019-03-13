import {Message, MessageAction, MessageType} from "../connection/message";
import {Socket} from "socket.io";

export class HostPeerManager {

    private workers = new Map<string, string>();

    constructor(private socket: Socket) {}

    handleMessage = (message: Message) => {
        if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
            this.workers.set(message.senderId, "");
        }
    }
}