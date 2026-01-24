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
  const orderId = payment_intent.metadata.orderId;

  console.log(`New event recived: ${event.type}`);


  switch (event.type) {
    case "payment_intent.succeeded":
      await ticketService.paymentSuccessful(orderId!, payment_intent.id);
      console.log({ id: payment_intent.id });
      break;

    case "payment_intent.payment_failed":
      // FIX: Add logic to set ticket status to 'FAILED'
      // and increment event capacity back +1
      await ticketService.handlePaymentFailure(orderId!);
      break;
  }

  res.json({ recived: true });
};

export default webhookStripe;
