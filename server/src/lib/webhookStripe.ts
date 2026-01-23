import { Request, Response } from "express";
import { stripe } from "./stripe";
import Stripe from "stripe";
import { ticketService } from "../modules/ticket/ticket.service";

const webhookStripe = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.log({ error });
    return res.status(400).send(`Webhook Error`);
  }

  const payment_intent = event.data.object as Stripe.PaymentIntent;

  console.log(`New event recived: ${event.type}`);

  if (event.type === "payment_intent.succeeded") {
    const orderId = payment_intent.metadata.orderId;

    await ticketService.paymentSuccessful(orderId!, payment_intent.id);

    console.log({ id: payment_intent.id });
  }

  // if (event.type === "charge.succeeded") {
  //   const charge = event.data.object;

  //   console.log({ charge });
  // }

  res.json({ recived: true });
};

export default webhookStripe;
