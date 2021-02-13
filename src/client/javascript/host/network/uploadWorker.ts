import {Message} from "../../webrtc-base/models/message";
import {RtcFileSender} from "./webrtc/rtcFileSender";
import {BaseFileSender} from "../../webrtc-base/baseFileSender";
import {Constants} from "../../../../shared/constants";
import RTC_INIT_TIMEOUT = Constants.RTC_INIT_TIMEOUT;
import {SocketFileSender} from "./webrtc/socketFileSender";
import Socket = SocketIOClient.Socket;

export class UploadWorker {

    private fileSender: BaseFileSender;

    private progress: number = 0;

    constructor(private id: string, private socket: Socket, private file: Blob){
        this.init();
    }

    private async init() {
        Promise.race([
            new Promise(resolve => {
                const rtcFileSender = new RtcFileSender(this.id, this.file, this.socket)
                rtcFileSender.initDataChannel()
                    .then((dataChannel) => {
                        dataChannel.onclose = this.onRTCClose;
                        return rtcFileSender;
                    })
            }),
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(new SocketFileSender(this.file, this.socket, this.id))
                }, RTC_INIT_TIMEOUT)
            }),
            new Promise(resolve => {
                let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
                if (iOS) {
                    resolve(new SocketFileSender(this.file, this.socket, this.id))
                }
            })
        ]).then((fileSender: BaseFileSender) => {
            this.onOpen(fileSender);
        })
    }

    private onOpen = (fileSender: BaseFileSender) => {
        console.log(`onopen: ${this.id}`);
        this.fileSender = fileSender;
        this.fileSender.onProgressChanged = this.onProgressChanged;
        this.fileSender.sendFiles()
    };

    private onRTCClose = () => {
        console.log('onclosed');
        this.fileSender = new SocketFileSender(this.file, this.socket, this.id);
        this.fileSender.sendFiles(this.progress);

    };

    private onProgressChanged = (progress: number) => {
        this.progress = progress;

        //console.log(this.progress);
    };
}
