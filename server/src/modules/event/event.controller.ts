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
    return res.status(200).json({
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
      req.params.id as string,
    );
    return res.status(200).json({
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
    const result = await eventService.publishEvent(req.body.event_id);
    res.status(200).json({
      success: true,
      message: "Event published successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to published event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const editEvent = async (req: Request, res: Response) => {
  try {
    const result = await eventService.editEvent(req.body);
    return res.status(200).json({
      success: true,
      message: "Event edited successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed edit the event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const myEvents = async (req: Request, res: Response) => {
  try {
    const result = await eventService.myEvents(req.user!.id);

    if (!result.length) {
      return res.status(200).json({
        success: false,
        message: "no events found",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Events retrived successfully",
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

export const eventController = {
  createEvent,
  getAllEvents,
  deleteEvent,
  publishEvent,
  editEvent,
  myEvents,
};
