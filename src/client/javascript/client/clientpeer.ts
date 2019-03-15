import {Socket} from "socket.io";
import {FileChunkRequest, Message, MessageAction, MessageType} from "../connection/message";
import {ClientPeerWrapper} from "../connection/peerwrapper";
import {ExternalPromise} from "../connection/externalpromise";

export class ClientPeer {

    private rtcPeer: RTCPeerConnection;
    private rtcWrapper: ClientPeerWrapper;
    private dataChannel: RTCDataChannel;

    private externalPromise: ExternalPromise<ArrayBuffer[]> = new ExternalPromise();

    private fileData: ArrayBuffer[] = [];

    constructor(public id: string, private socket: Socket, private fileName: string, private chunkStart: number, private chunkEnd: number){
        this.rtcPeer = new RTCPeerConnection();
        this.rtcWrapper = new ClientPeerWrapper(this.rtcPeer, id, socket);

        this.init();
    }

    public handleMessage = (message: Message) => {
        this.rtcWrapper.handleMessage(message);
    };

    public getCompleteListener() {
        return this.externalPromise.promise;
    }

    private requestFileChunk = () => this.socket.send(
        new Message(
            this.id,
            MessageType.Request,
            MessageAction.CreatePeer,
            new FileChunkRequest(this.fileName, this.chunkStart, this.chunkEnd))
        );

    private init = () => {
        this.rtcWrapper.initDataChannel()
            .then((dataChannel) => {
                this.dataChannel = dataChannel;
                this.onopen()
            });

        this.requestFileChunk();
    };

    private onopen = () => {
        console.log(`onopen: ${this.id}`);
        this.dataChannel.onmessage = this.onmessage;
    };

    private onclose = () => {
        console.log(`onclose: ${this.id}`)
    };

    private onmessage = (message: MessageEvent) => {
        if (message.data !== 'eof') {
            this.fileData.push(message.data)
        } else {
            this.externalPromise.resolve(this.fileData)
        }
    }
}
