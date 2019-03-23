import {Socket} from "socket.io";
import {Server} from "http";
import {RedisClient} from "redis";
import {Host} from "./host";
import * as redis from "redis";
import * as randomstring from "randomstring";

import {HostModel} from "../models/models";
import {Constants} from "../../shared/constants";
import RequestHostRequestModel = Constants.RequestHostRequestModel;
import {Client} from "./client";
import CONNECT = Constants.CONNECT;
import DISCONNECT = Constants.DISCONNECT;

const SocketIo = require('socket.io');

export class SocketManager {

    private io: SocketIO.Server;

    constructor(private server: Server, private hostMap: Map<string, HostModel>) {
        this.io = new SocketIo(server);
        this.io.on(CONNECT, this.connection);
    }

    private connection = (socket: Socket) => {
        socket.on(Constants.REQUEST_HOST, (req: RequestHostRequestModel) => {
            let host = new Host(socket, this.io, this.hostMap);
            host.createHost(req);

            socket.on(DISCONNECT, () => host.destroyHost())
        });

        socket.on(Constants.REQUEST_CLIENT, (roomId: string) => {
            let client = new Client(socket, this.io, this.hostMap, roomId);
            client.createClient();
        })
    }
}