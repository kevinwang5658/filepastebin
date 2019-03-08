import { Socket } from "socket.io";
import { Constants } from '../../shared/constants'
import {RedisClient} from "redis";
import {HostModel} from "../models/models";
import {Logger} from "../config/logger";

import * as randomstring from 'randomstring'
import {Base} from "./base";

export class Host extends Base {

    private model: HostModel;

    constructor(
        socket: Socket,
        private io: SocketIO.Server,
        private hostMap: Map<string, HostModel>) {
        super(socket)
    }

    public createHost() {
        let sessionId = this.generateSessionID();
        this.model = {
            sessionId: sessionId,
            hostId: this.socket.id,
        };
        this.hostMap.set(sessionId, this.model);

        this.socket.join(sessionId);
        this.socket.emit(Constants.REQUEST_HOST_ACCEPTED, sessionId);

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
