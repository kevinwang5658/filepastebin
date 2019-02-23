import {Socket} from "socket.io";

const SocketIo = require('socket.io');
const ConnectionManager = require('./ConnectionManager');

class SocketManager {

    private io: SocketIO.Server;

    constructor(private server, private redisClient) {
        this.io = SocketIo(server);
        this.io.on('connect', this.connection)
    }

    private connection(client: Socket) {
        let socket = new ConnectionManager(this.io, client)
    }

}

module.exports = SocketManager;

export {};
