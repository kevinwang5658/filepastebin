import {Message} from "../../webrtc-base/models/message";
import {HostPeerWrapper} from "../../webrtc-base/peerwrapper";
import {RtcFileSender} from "../../webrtc-base/rtcfilesender";
import {BaseFileSender} from "../../webrtc-base/BaseFileSender";
import {Constants} from "../../../../shared/constants";
import RTC_INIT_TIMEOUT = Constants.RTC_INIT_TIMEOUT;
import {SocketFileSender} from "../../webrtc-base/socketfilesender";
import Socket = SocketIOClient.Socket;

export class HostPeer {

    private rtcPeer: RTCPeerConnection;
    private rtcWrapper: HostPeerWrapper;
    private fileSender: BaseFileSender;

    private progress: number = 0;

    constructor(private id: string, private socket: Socket, private fileSlice: Blob){
        this.rtcPeer = new RTCPeerConnection(Constants.PeerConfiguration);
        this.rtcWrapper = new HostPeerWrapper(this.rtcPeer, this.id, this.socket);

        this.init();
    }

    handleMessage = (message: Message) => {
        this.rtcWrapper.handleMessage(message)
    };

    private async init() {
        Promise.race([
            this.rtcWrapper.initDataChannel()
                .then((dataChannel) => {
                    dataChannel.onclose = this.onrtcclose;
                    dataChannel.onerror = this.onrtcerror;

                    return new RtcFileSender(this.fileSlice, dataChannel);
            }),
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(new SocketFileSender(this.fileSlice, this.socket, this.id))
                }, RTC_INIT_TIMEOUT)
            }),
            new Promise(resolve => {
                let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
                if (iOS) {
                    resolve(new SocketFileSender(this.fileSlice, this.socket, this.id))
                }
            })
        ]).then((fileSender: BaseFileSender) => {
            this.onopen(fileSender);
        })
    }

    private onopen = (fileSender: BaseFileSender) => {
        console.log(`onopen: ${this.id}`);
        this.fileSender = fileSender;
        this.fileSender.onprogresschanged = this.onprogresschanged;
        this.fileSender.sendFiles()
    };

    private onrtcerror = (err: Event) => console.log(`onerror${err}`);

    private onrtcclose = () => {
        console.log('onclosed');
        this.fileSender = new SocketFileSender(this.fileSlice, this.socket, this.id);
        this.fileSender.sendFiles(this.progress);

    };

    private onprogresschanged = (progress: number) => {
        this.progress = progress;

        //console.log(this.progress);
    };
}
