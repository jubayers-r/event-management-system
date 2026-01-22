import { Router } from "express";
import { eventController } from "./event.controller";
import authorization, { UserRole } from "../../middleware/authorization";

const router = Router();

router.post(
  "/",
  authorization(UserRole.HOST, UserRole.MANAGER),
  eventController.createEvent,
);

router.get("/", eventController.getAllEvents);

export const eventRoutes = router;
