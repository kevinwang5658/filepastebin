import {Constants} from "../../../../shared/constants";
import {FileChunkRequest, Message, MessageAction, MessageType} from "../../webrtc-base/models/message";
import {HostPeer} from "./hostpeer";
import Socket = SocketIOClient.Socket;

export class HostPeerManager {

    private workers = new Map<string, HostPeer>();

    constructor(private socket: Socket, private file: Constants.File[]) {}

    handleMessage = (message: Message) => {
        if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
            let request: FileChunkRequest = message.content;

            this.workers.set(message.senderId, new HostPeer(message.senderId, this.socket, this.file.slice(request.chunkStart, request.chunkEnd)));
        } else if (message.type === MessageType.Signal) {
            this.workers.get(message.senderId).handleMessage(message)
        }
    }
}
