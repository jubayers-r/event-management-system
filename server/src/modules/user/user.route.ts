import { Router } from "express";
import { userController } from "./user.controller";
import authorization, { UserRole } from "../../middleware/authorization";

const router = Router();

router.get(
  "/",
  authorization(UserRole.USER, UserRole.HOST, UserRole.MANAGER),
  userController.getMyBookings,
);

export const userRoutes = router;
