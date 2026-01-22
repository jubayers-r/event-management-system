import { Router } from "express";
import authorization, { UserRole } from "../../middleware/authorization";
import { ticketController } from "./ticket.controller";

const router = Router();

router.post(
  "/buy",
  authorization(UserRole.USER, UserRole.HOST, UserRole.MANAGER),
  ticketController.buyTicket,
);
router.post(
  "/cancel",
  authorization(UserRole.USER, UserRole.HOST, UserRole.MANAGER),
  ticketController.cancelTicket,
);

export const ticketRoutes = router;
