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
  } catch (error: any) {

    // Specific error mapping
    if (error.message === "SOLD_OUT" || error.code === "P2025") {
      // P2025 is Prisma "Record not found"
      return res.status(400).json({
        success: false,
        message: "This event is sold out!",
        errorCode: "ERR_SOLD_OUT",
      });
    }

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

    return res.status(201).json({
      success: true,
      message: "Ticket cancelled successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancellation ticket",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getMyTickets = async (req: Request, res: Response) => {
  try {
    const result = await ticketService.getMyTickets(req.user!.id);
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "No results found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Found events succesfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const ticketController = { buyTicket, cancelTicket, getMyTickets  };
