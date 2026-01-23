import { Request, Response } from "express";
import { stripeService } from "./stripe.service";

const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const result = await stripeService.paymentIntent(amount);

  res.send({
    clientSecret: result.client_secret,
  });
};

export const stripeController = { createPaymentIntent };
