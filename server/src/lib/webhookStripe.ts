import { Request, Response } from "express";
import { stripe } from "./stripe";

const webhookStripe = async (req: Request, res: Response) => {
  (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"]!;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "payment_intent.succeeded") {
      const payment_intent = event.data.object;

      console.log({ id: payment_intent.id });
    }

    res.json({ recived: true });
  };
};

export default webhookStripe;
