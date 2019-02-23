import {Socket} from "socket.io";

class ConnectionManager {
    constructor(private io: SocketIO.Server, private client: Socket) {
        console.log(client.conn.id)
    }
}

module.exports = ConnectionManager;
