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

router.get(
  "/my-tickets",
  authorization(UserRole.USER, UserRole.HOST, UserRole.MANAGER),
  ticketController.getMyTickets,
);

export const ticketRoutes = router;
