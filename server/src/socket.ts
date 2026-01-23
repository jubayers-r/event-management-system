import { IncomingMessage, Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";

type ClientMessage = {
  type: "SEND_MESSAGE";
  receiverId: string;
  chatId: string; // Added: Frontend must send which chat this belongs to
  message: string;
};

type ServerMessage = {
  type: "MESSAGE";
  message: {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
  };
};

export const clients = new Map<string, WebSocket>();

export function initWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (socket: WebSocket, req: IncomingMessage) => {
    // 1. Authentication Check
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const userId = session?.user.id;

    if (!userId) {
      console.error("WS Connection rejected: No session found");
      socket.close(1008); // Policy Violation
      return;
    }

    // Store the active connection
    clients.set(userId, socket);
    console.log(`User connected: ${userId}`);

    socket.on("message", async (data) => {
      let payload: ClientMessage;
      try {
        payload = JSON.parse(data.toString());
      } catch {
        return;
      }

      // 2. Validate Payload
      if (
        payload.type !== "SEND_MESSAGE" ||
        !payload.receiverId ||
        !payload.chatId ||
        !payload.message
      ) return;

      try {
        // 3. Persist to Database
        // We save it here so that if the receiver refreshes, the message is there.
        const savedMessage = await prisma.message.create({
          data: {
            chatId: payload.chatId,
            senderId: userId,
            content: payload.message,
          },
          include: {
            sender: {
              select: { id: true, name: true, image: true }
            }
          }
        });

        // 4. Prepare Broadcast Data
        const outgoing = JSON.stringify({
          type: "MESSAGE",
          message: savedMessage,
        });

        // 5. Send to Receiver
        const receiverSocket = clients.get(payload.receiverId);
        if (receiverSocket?.readyState === WebSocket.OPEN) {
          receiverSocket.send(outgoing);
        }

        // 6. Optional: Send confirmation back to Sender
        // (Helps with "delivered" UI states)
        socket.send(outgoing);

      } catch (error) {
        console.error("Failed to save/send message:", error);
        socket.send(JSON.stringify({ type: "ERROR", message: "Failed to send message" }));
      }
    });

    socket.on("close", () => {
      clients.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      clients.delete(userId);
    });
  });
}
