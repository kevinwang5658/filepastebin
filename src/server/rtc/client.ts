import {Base} from "./base";
import {Socket} from "socket.io";
import {HostModel} from "../models/models";
import {Constants} from "../../shared/constants";

export class Client extends Base {

    constructor(
        socket: Socket,
        private io: SocketIO.Server,
        private hostMap: Map<string, HostModel>,
        private roomId: string) {
        super(socket)
    }

    public createClient() {
        if (!this.hostMap.get(this.roomId)) {
            this.socket.emit('exception', 'host disconnected');
            return;
        }

        this.socket.join(this.roomId);
        this.socket.emit(Constants.REQUEST_CLIENT_ACCEPTED);
    }

}