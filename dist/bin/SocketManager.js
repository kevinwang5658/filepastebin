const SocketIo = require('socket.io');
const ConnectionManager = require('./ConnectionManager');
class SocketManager {
    constructor(server, redisClient) {
        this.server = server;
        this.redisClient = redisClient;
        this.io = SocketIo(server);
        this.io.on('connect', this.connection);
    }
    connection(client) {
        let socket = new ConnectionManager(this.io, client);
    }
}
module.exports = SocketManager;
//# sourceMappingURL=SocketManager.js.map