class WebSocketService {
    constructor() {
        this.connections = new Set();
    }

    addConnection(ws) {
        this.connections.add(ws);
    }

    removeConnection(ws) {
        this.connections.delete(ws);
    }

    broadcast(data) {
        this.connections.forEach(client => {
            if (client.readyState === 1) { // Check if connection is OPEN
                client.send(JSON.stringify(data));
            }
        });
    }

    sendToUser(userId, data) {
        this.connections.forEach(client => {
            if (client.userId === userId && client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

const wsService = new WebSocketService();
module.exports = { wsService };