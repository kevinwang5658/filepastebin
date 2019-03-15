import {Socket} from "socket.io";
import {Message} from "../connection/message";
import {FileSender} from "../connection/filesender";
import {HostPeerWrapper} from "../connection/peerwrapper";

export class HostPeer {

    private rtcPeer: RTCPeerConnection;
    private rtcWrapper: HostPeerWrapper;
    private dataChannel: RTCDataChannel;
    private fileSender: FileSender;

    constructor(private id: string, private socket: Socket, private fileSlice: Blob){
        this.rtcPeer = new RTCPeerConnection();
        this.rtcWrapper = new HostPeerWrapper(this.rtcPeer, this.id, this.socket);

        this.init();
    }

    handleMessage = (message: Message) => {
        this.rtcWrapper.handleMessage(message)
    };

    private init() {
        this.rtcWrapper.initDataChannel()
            .then((dataChannel) => {
                this.dataChannel = dataChannel;
                this.onopen();
            })
    }

    private onopen = () => {
        console.log(`onopen: ${this.id}`);
        this.fileSender = new FileSender(this.fileSlice, this.dataChannel);
        this.fileSender.sendFiles()
    };

    private onclose = () => {
        console.log('onclosed');
    }
}