import { IncomingMessage, Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

type ClientMessage = {
  type: "SEND_MESSAGE";
  ticketId: string;
  message: string;
};

type ServerMessage = {
  type: "MESSAGE";
  message: {
    id: string;
    ticketId: string;
    content: string;
    createdAt: string;
  };
};

export const clients = new Map<string, WebSocket>();

export function initWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (socket: WebSocket, req: IncomingMessage) => {
    // console.log(req.url);
    const token = req.url?.split("?token=")[1];
    // console.log({ token });

    let decoded;

    try {
      decoded = jwt.verify(
        token!,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      // 1. Authentication Check
      const session = decoded;

      if (!session.id) {
        console.error("WS Connection rejected: No session found");
        socket.close(1008); // Policy Violation
        return;
      }

      const userId = session?.id;

      // Store the active connection
      clients.set(userId, socket);
      // console.log({ session });

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
          !payload.ticketId ||
          !payload.message
        )
          return;

        const ticket = await prisma.ticket.findFirst({
          where: {
            id: payload.ticketId,
          },
          select: {
            id: true,
            user_id: true,
            event: {
              select: {
                hostId: true,
              },
            },
          },
        });

        if (!ticket?.id) {
          socket.send(
            JSON.stringify({
              type: "ERROR",
              message: "Ticket not found",
            }),
          );
        }

        console.log({ ticket });

        try {
          // 3. Persist to Database
          // We save it here so that if the receiver refreshes, the message is there.
          const savedMessage = await prisma.message.create({
            data: {
              senderId: session.id,
              content: payload.message,
              ticketId: payload.ticketId,
            },
            include: {
              sender: {
                select: { id: true, name: true, image: true },
              },
            },
          });

          if (!savedMessage.ticketId) {
            throw new Error("Ticket not found");
          }

          // 4. Prepare Broadcast Data
          const outgoing = JSON.stringify({
            type: "MESSAGE",
            message: savedMessage,
          });

          const receiverId =
            session.id == ticket?.event.hostId
              ? ticket?.user_id
              : ticket?.event.hostId;

          // 5. Send to Receiver
          const receiverSocket = clients.get(receiverId!);
          if (receiverSocket?.readyState === WebSocket.OPEN) {
            receiverSocket.send(outgoing);
          }

          console.log({
            clients,
          });
          console.log({ receiverId, userId });
          // 6. Optional: Send confirmation back to Sender
          // (Helps with "delivered" UI states)
          socket.send(outgoing);
        } catch (error) {
          console.error("Failed to save/send message:", error);
          socket.send(
            JSON.stringify({
              type: "ERROR",
              message: "Failed to send message",
            }),
          );
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
    } catch (error) {
      console.error({ error });
      console.error("WS Connection rejected: No session found");
      socket.close(1008); // Policy Violation
      return;
    }
  });
}
