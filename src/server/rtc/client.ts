import {Base} from "./base";
import {Socket} from "socket.io";
import {HostModel} from "../models/models";

export class Client extends Base {

    constructor(
        private socket: Socket,
        private io: SocketIO.Server,
        private host: HostModel) {
        super()
    }

}