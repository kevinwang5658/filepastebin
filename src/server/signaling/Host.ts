import { Socket } from "socket.io";
import { Constants } from '../../shared/constants'
import {RedisClient} from "redis";
import {HostModel} from "../models/HostModel";
import {Logger} from "../config/logger";

import * as randomstring from 'randomstring'
import {Base} from "./Base";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import RequestHostRequestModel = Constants.RequestHostRequestModel;

export class Host extends Base {

    private host: HostModel;

    constructor(
        socket: Socket,
        private io: SocketIO.Server,
        private hostMap: Map<string, HostModel>) {
        super(socket)
    }

    public createHost(req: RequestHostRequestModel) {
        let roomId = this.generateSessionID();
        this.host = {
            roomId: roomId,
            hostId: this.socket.id,
            files: req.files
        };
        this.hostMap.set(roomId, this.host);

        this.socket.join(roomId);
        this.socket.emit(Constants.REQUEST_HOST_ACCEPTED, <RequestHostAcceptedModel>{
            roomId: roomId,
            files: req.files
        });

        Logger.info(`Host created: ${this.host.roomId}`);
    }

    public destroyHost() {
        this.socket.leave(this.host.roomId);
        this.hostMap.delete(this.host.roomId);
        Logger.info(`Host destroyed: ${this.host.roomId}`);
    }

    private generateSessionID(): string {
        let sessionId: string;

        do {
            sessionId = randomstring.generate({
                length:6,
                charset: 'numeric'
            })
        } while (this.hostMap.get(sessionId));

        return sessionId
    }
}
