import { Request, Response } from "express";
import { userService } from "./user.service";

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const result = await userService.getMyBookings(req.user!.id);
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
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const userController = { getMyBookings };
