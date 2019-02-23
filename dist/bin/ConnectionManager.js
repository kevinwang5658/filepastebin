class ConnectionManager {
    constructor(io, client) {
        this.io = io;
        this.client = client;
        console.log(client.conn.id);
    }
}
module.exports = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map