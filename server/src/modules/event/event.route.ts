import { Router } from "express";
import { eventController } from "./event.controller";
import authorization, { UserRole } from "../../middleware/authorization";

const router = Router();

router.post(
  "/",
  authorization(), //any user can post an event
  eventController.createEvent,
);

router.get("/", eventController.getAllEvents);

router.delete(
  "/delete",
  authorization(UserRole.HOST, UserRole.MANAGER),
  eventController.deleteEvent,
);
router.patch(
  "/publish",
  authorization(UserRole.MANAGER),
  eventController.publishEvent,
);

export const eventRoutes = router;
