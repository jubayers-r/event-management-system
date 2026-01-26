import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.create);
router.post("/signin", authController.login);
router.post("/signout", authController.logout);

export const authRoutes = router;
