import { Router } from "express";
import { stripeController } from "./stripe.controller";

const router = Router();

router.post("/create-payment-intent", stripeController.createPaymentIntent);

export const stripeRoutes = router;
