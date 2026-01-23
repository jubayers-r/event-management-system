import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { clients } from "../../socket";

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, message } = req.body;

    // 1. Validate inputs early
    if (!senderId || !receiverId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (receiverId === senderId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot chat with yourself" });
    }

    // 2. Ticket verification
    const ticket = await prisma.ticket.findFirst({
      where: { user_id: senderId, status: "PAID" },
      select: { id: true },
    });

    if (!ticket) {
      return res.status(403).json({
        success: false,
        message: "Chat not available: No paid ticket found",
      });
    }

    // 1. Find or Create the Chat
    let chat = await prisma.chat.findFirst({
      where: {
        ticketId: ticket.id,
        AND: [
          { members: { some: { userId: senderId } } },
          { members: { some: { userId: receiverId } } },
        ],
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          ticketId: ticket.id,
          members: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });
    }

    // 2. ALWAYS create the new message
    const newMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: senderId,
        content: message,
      },
    });

    // 3. Notify Receiver via Socket
    const receiverSocket = clients.get(receiverId);
    if (receiverSocket?.readyState === 1) {
      receiverSocket.send(
        JSON.stringify({
          type: "MESSAGE_RECEIVED", // Or "MESSAGE" to match your WS server type
          payload: {
            ...newMessage,
            chatId: chat.id,
          },
        }),
      );
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
      chatId: chat.id,
    });
  } catch (error) {
    // The 'try' block now closes correctly before this catch
    next(error);
  }
};
