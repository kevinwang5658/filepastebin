import {Constants} from "../../../../shared/constants";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import MESSAGE = Constants.MESSAGE;
import {FileRequest, Message, MessageAction, MessageType} from "../../webrtc-base/models/message";
import DISCONNECT = Constants.DISCONNECT;
import ERROR = Constants.ERROR;
import REQUEST_HOST_ACCEPTED = Constants.REQUEST_HOST_ACCEPTED;
import Socket = SocketIOClient.Socket;
import FileDescription = Constants.FileDescription;
import {HostPeer} from "./hostpeer";

export class HostNetworkManager {

    private workers = new Map<string, HostPeer>();

    //Override outside to listen
    public onRoomCreatedCallback: (response: RequestHostAcceptedModel) => void;

    constructor(private socket: Socket, private files: File[]){
        socket.on(DISCONNECT, (reason) => console.log(reason));
        socket.on(ERROR, (err) => console.log(err));
        socket.on(REQUEST_HOST_ACCEPTED, this.onRoomCreated);
        socket.on(MESSAGE, this.onMessage);

        this.createSocketIORoom(files);
    }

    public createSocketIORoom = (files: File[]) => {
        let fileDescriptions = files.map(u => (<FileDescription>{
            fileName: u.name,
            fileSize: u.size,
            fileType: u.type
        }));

        console.log(fileDescriptions);

        this.socket.emit(Constants.REQUEST_HOST, {
            files: fileDescriptions
        });
    };

    private onRoomCreated = (response: RequestHostAcceptedModel) => {
        this.onRoomCreatedCallback(response);
    };

    private onMessage = (message: Message) => {
        if (message.type === MessageType.Request && message.action === MessageAction.CreatePeer) {
            let request: FileRequest = message.content;

            let file = this.files.find(u => u.name === request.fileName)

            this.workers.set(message.senderId, new HostPeer(message.senderId, this.socket, file));
        } else if (message.type === MessageType.Signal) {
            this.workers.get(message.senderId).handleMessage(message)
        }
    }

}
