import {FileChunkRequest, Message, MessageAction, MessageType} from "../../webrtc-base/models/message";
import {ClientPeerWrapper} from "../../webrtc-base/peerwrapper";
import {PromiseWrapper} from "../../helpers/PromiseWrapper";
import {Constants} from "../../../../shared/constants";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import Socket = SocketIOClient.Socket;

export class ClientPeer {

    public progress = 0;

    private rtcPeer: RTCPeerConnection;
    private rtcWrapper: ClientPeerWrapper;
    private dataChannel: RTCDataChannel;

    private externalPromise: PromiseWrapper<ArrayBuffer[]> = new PromiseWrapper();

    private fileData: ArrayBuffer[] = [];

    constructor(public id: string, private socket: Socket, private fileName: string, private chunkStart: number, private chunkEnd: number, private chunkSize: number){
        this.rtcPeer = new RTCPeerConnection(Constants.PeerConfiguration);
        this.rtcWrapper = new ClientPeerWrapper(this.rtcPeer, id, socket);

        this.init();
    }

    public handleMessage = (message: Message) => {
        this.rtcWrapper.handleMessage(message);
        if (message.type === MessageType.Data) {
            this.onmessage(message.content)
        }
    };

    public getCompleteListener() {
        return this.externalPromise.promise;
    }

    public onprogresschanged: (number: number) => void = (number) => {};

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
                console.log(`onopen: ${this.id}`);

                this.dataChannel = dataChannel;
                this.dataChannel.onmessage = (ev: MessageEvent) => this.onmessage(ev.data);
            });

        this.requestFileChunk();
    };

    private onmessage = (message: any) => {
        if (message !== 'eof') {
            this.fileData.push(message);
            this.progress = (this.fileData.length * BYTES_PER_CHUNK) / this.chunkSize
        } else {
            this.externalPromise.resolve(this.fileData);
            this.progress = 1;

            if (this.dataChannel) {
                this.dataChannel.close();
                this.rtcPeer.close();
            }
        }

        this.onprogresschanged(this.progress);
    }
}
