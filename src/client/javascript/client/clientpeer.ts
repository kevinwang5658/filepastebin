import {BasePeer} from "../connection/basepeer";
import {Socket} from "socket.io";
import {FileChunkRequest, Message, MessageAction, MessageType} from "../connection/message";

export class ClientPeer extends BasePeer{

    constructor(id: string, socket: Socket, private fileName: string, private chunkStart: number, private chunkEnd: number){
        super(id, socket);

        this.requestFileChunk()
    }

    requestFileChunk = () => this.socket.send(
        new Message(
            this.id,
            MessageType.Request,
            MessageAction.CreatePeer,
            new FileChunkRequest(this.fileName, this.chunkStart, this.chunkEnd))
        );
}
