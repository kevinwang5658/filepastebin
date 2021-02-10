import {Constants} from "../../../../shared/constants";
import {FileRequest, Message, MessageAction, MessageType} from "../../webrtc-base/models/message";
import {HostPeer} from "./hostpeer";
import Socket = SocketIOClient.Socket;

export class HostPeerManager {

    private workers = new Map<string, HostPeer>();

    constructor(private socket: Socket, private files: File[]) {}

    handleMessage = (message: Message) => {
        if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
            let request: FileRequest = message.content;

            let file = this.files.find(u => u.name === request.fileName)

            this.workers.set(message.senderId, new HostPeer(message.senderId, this.socket, file));
        } else if (message.type === MessageType.Signal) {
            this.workers.get(message.senderId).handleMessage(message)
        }
    }
}
