class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Set();
    }

    connect(token) {
        const API = import.meta.env.VITE_API || "http://localhost:8080";
        const wsUrl = API.replace(/^http/, 'ws');
        
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`${wsUrl}/notifications?token=${token}`);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
                this.notifyListeners(data.data);
            }
        };

        this.ws.onclose = (event) => {
            if (event.code === 1008) {
                console.error('WebSocket closed due to authentication error:', event.reason);
                // Handle auth error if needed
            }
            
            // Try to reconnect after 5 seconds if not closed due to auth error
            if (event.code !== 1008) {
                setTimeout(() => this.connect(token), 5000);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(notification) {
        this.listeners.forEach(callback => callback(notification));
    }
}

export const wsService = new WebSocketService();