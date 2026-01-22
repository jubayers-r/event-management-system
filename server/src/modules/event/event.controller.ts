import { Request, Response } from "express";
import { eventService } from "./event.service";

const createEvent = async (req: Request, res: Response) => {
  try {
    const result = await eventService.createEvent({ ...req.body });
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const result = await eventService.getAllEvents();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get any event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const eventController = { createEvent, getAllEvents };
