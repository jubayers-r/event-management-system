import { NextFunction, Request, Response } from "express";
import { charServices } from "./chat.service";

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;


    const result = await charServices.getMessages(ticketId as string);

    return res.status(200).json({
      success: true,
      message: "messages retrived successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get messages",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const chatControllers = { getChats };
