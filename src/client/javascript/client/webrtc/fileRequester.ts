import {PromiseWrapper} from "../../helpers/PromiseWrapper";
import {Constants} from "../../../../shared/constants";
import BYTES_PER_CHUNK = Constants.BYTES_PER_CHUNK;
import Socket = SocketIOClient.Socket;
import {ClientRTCPeerConnectionWrapper} from "./clientRTCPeerConnectionWrapper";
import {FileRequest, Message, MessageAction, MessageType} from "../../webrtc-base/models/message";

export class fileRequester {

    public progress = 0;

    private rtcPeer: RTCPeerConnection;
    private rtcWrapper: ClientRTCPeerConnectionWrapper
    private dataChannel: RTCDataChannel;
    private externalPromise: PromiseWrapper<ArrayBuffer[]> = new PromiseWrapper();
    private fileData: ArrayBuffer[] = [];

    constructor(public id: string, private socket: Socket, public file: Constants.FileDescription){
        this.rtcPeer = new RTCPeerConnection(Constants.PeerConfiguration);
        this.rtcWrapper = new ClientRTCPeerConnectionWrapper(this.rtcPeer, id, socket);

        this.init();
    }

    public handleMessage = (message: Message) => {
        this.rtcWrapper.handleMessage(message);
        if (message.type === MessageType.Data) {
            this.onRTCMessage(message.content)
        }
    };

    public getCompleteListener() {
        return this.externalPromise.promise;
    }

    public onProgressChangedCallback: (number: number) => void = (number) => {};

    private requestFile = () => this.socket.send(
        new Message(
            this.id,
            MessageType.Request,
            MessageAction.CreatePeer,
            new FileRequest(this.file.fileName))
        );

    private init = () => {
        this.rtcWrapper.initDataChannel()
            .then((dataChannel) => {
                console.log(`onopen: ${this.id}`);

                this.dataChannel = dataChannel;
                this.dataChannel.onmessage = (ev: MessageEvent) => this.onRTCMessage(ev.data);
            });

        this.requestFile();
    };

    private onRTCMessage = (message: any) => {
        if (message !== 'eof') {
            this.fileData.push(message);
            // this.progress = (this.fileData.length * BYTES_PER_CHUNK) / this.chunkSize
        } else {
            this.externalPromise.resolve(this.fileData);
            this.progress = 1;

            if (this.dataChannel) {
                this.dataChannel.close();
                this.rtcPeer.close();
            }
        }

        this.onProgressChangedCallback(this.progress);
    }
}
