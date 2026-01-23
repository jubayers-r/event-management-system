import { Request, Response } from "express";
import { ticketService } from "./ticket.service";

const buyTicket = async (req: Request, res: Response) => {
  try {
    const result = await ticketService.buyTicket(
      req.user!.id,
      req.body.event_id,
    );

    return res.status(201).json({
      success: true,
      message: "Ticket bought successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to buy ticket",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const cancelTicket = async (req: Request, res: Response) => {
  try {
    const result = await ticketService.cancelTicket(
      req.user!.id,
      req.body.ticket_id,
    );

    res.status(201).json({
      success: true,
      message: "Ticket cancelled successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancellation ticket",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const ticketController = { buyTicket, cancelTicket };
