import { Request, Response } from "express";
import { eventService } from "./event.service";

const createEvent = async (req: Request, res: Response) => {
  try {
    const result = await eventService.createEvent(req.body, req.user!.id);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
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

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const result = await eventService.getAllEvents();
    return res.status(201).json({
      success: true,
      message: "Event retrived successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get any event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const result = await eventService.deleteEvent(
      req.user!.id,
      req.body.event_id,
    );
    return res.status(201).json({
      success: true,
      message: "Event deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const publishEvent = async (req: Request, res: Response) => {
  try {
    const result = await eventService.publishEvent(
      req.user!.id,
      req.body.event_id,
    );
    res.status(201).json({
      success: true,
      message: "Event publish successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to publish event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const eventController = {
  createEvent,
  getAllEvents,
  deleteEvent,
  publishEvent,
};
