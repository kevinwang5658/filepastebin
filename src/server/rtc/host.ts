import { Socket } from "socket.io";
import { Constants } from '../../shared/constants'
import {RedisClient} from "redis";
import {HostModel} from "../models/models";
import {Logger} from "../config/logger";

import * as randomstring from 'randomstring'
import {Base} from "./base";
import RequestHostAcceptedModel = Constants.RequestHostAcceptedModel;
import RequestHostRequestModel = Constants.RequestHostRequestModel;

export class Host extends Base {

    private model: HostModel;

    constructor(
        socket: Socket,
        private io: SocketIO.Server,
        private hostMap: Map<string, HostModel>) {
        super(socket)
    }

    public createHost(req: RequestHostRequestModel) {
        let roomId = this.generateSessionID();
        this.model = {
            sessionId: roomId,
            hostId: this.socket.id,
            fileName: req.fileName,
            fileSize: req.fileSize,
            fileType: req.fileType

        };
        this.hostMap.set(roomId, this.model);

        this.socket.join(roomId);
        this.socket.emit(Constants.REQUEST_HOST_ACCEPTED, <RequestHostAcceptedModel>{
            roomId: roomId,
            fileName: req.fileName,
            fileSize: req.fileSize,
            fileType: req.fileType
        });

        Logger.info(`Host created: ${this.model.sessionId}`);
    }

    public destroyHost() {
        this.socket.leave(this.model.sessionId);
        Logger.info(`Host destroyed: ${this.model.sessionId}`);
    }

    private generateSessionID(): string {
        let sessionId: string;

        do {
            sessionId = randomstring.generate({
                length:5,
                capitalization: 'uppercase'
            })
        } while (this.hostMap.get(sessionId));

        return sessionId
    }
}
