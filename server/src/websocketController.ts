    const clients = new Map<string, WebSocket>();

    const addClent = (clientId: string, socket: WebSocket) => {
    clients.set(clientId, socket);
    };

    const removeClient = (clientId: string) => {
    clients.delete(clientId);
    };

    const sendMessage = (userId: string, message: string) => {
    const socket = clients.get(userId);

    if (socket) {
        socket.send(message);
    }
    };

    export const WebSocketController = {
    addClent,
    removeClient,
    sendMessage,
    };
