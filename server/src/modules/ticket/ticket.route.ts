import { Router } from "express";
import authorization, { UserRole } from "../../middleware/authorization";
import { ticketController } from "./ticket.controller";

const router = Router();

router.post(
  "/buy",
  authorization(UserRole.USER, UserRole.HOST, UserRole.MANAGER),
  ticketController.buyTicket,
);

export const ticketRoutes = router;
