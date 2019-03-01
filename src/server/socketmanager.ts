import {Socket} from "socket.io";
import {Server} from "http";
import {RedisClient} from "redis";

const SocketIo = require('socket.io');
const ConnectionManager = require('./connectionmanager');

class Socketmanager {

    private io: SocketIO.Server;

    constructor(private server: Server, private redisClient: RedisClient) {
        this.io = SocketIo(server);
        this.io.on('connect', this.connection);
        this.io.on('disconnect', this.disconnection);
    }

    private connection(client: Socket) {
        let socket = new ConnectionManager(this.io, client)
    }

    private disconnection() {
        console.log('hi');
    }

}

module.exports = Socketmanager;

export {};
