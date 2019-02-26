import {Socket} from "socket.io";

const SocketIo = require('socket.io');
const ConnectionManager = require('./ConnectionManager');

class SocketManager {

    private io: SocketIO.Server;

    constructor(private server, private redisClient) {
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

module.exports = SocketManager;

export {};
