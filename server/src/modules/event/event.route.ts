import { Router } from "express";
import { eventController } from "./event.controller";
import authorization, { UserRole } from "../../middleware/authorization";

const router = Router();

router.post(
  "/",
  authorization(), //any user can post an event
  eventController.createEvent,
);

router.get("/", authorization(UserRole.OPTIONAL), eventController.getAllEvents);
router.get("/my-events", authorization(), eventController.myEvents);

router.get("/:id", eventController.getOneEvent);

router.delete(
  "/:id",
  authorization(UserRole.HOST, UserRole.MANAGER),
  eventController.deleteEvent,
);
router.patch(
  "/publish",
  authorization(UserRole.MANAGER),
  eventController.publishEvent,
);

router.patch(
  "/edit",
  authorization(UserRole.HOST, UserRole.MANAGER),
  eventController.editEvent,
);

export const eventRoutes = router;
