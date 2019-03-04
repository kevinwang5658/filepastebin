import {Socket} from "socket.io";
import {Server} from "http";
import {RedisClient} from "redis";
import {Host} from "./host";
import * as redis from "redis";
import * as randomstring from "randomstring";

import * as Constants from '../../shared/constants'
import {HostModel} from "../models/models";

const SocketIo = require('socket.io');

export class SocketManager {

    private io: SocketIO.Server;

    constructor(private server: Server, private hostMap: Map<String, HostModel>) {
        this.io = new SocketIo(server);
        this.io.on('connect', this.connection);
    }

    private connection = (socket: Socket) => {
        socket.on(Constants.SocketIO.REQUEST_HOST, () => {
            let host = new Host(socket, this.io, this.hostMap);
            host.createHost();

            socket.on('disconnect', () => host.destroyHost())
        });
    }
}