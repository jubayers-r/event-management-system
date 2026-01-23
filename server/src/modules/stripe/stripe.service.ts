import { stripe } from "../../stripe";

const paymentIntent = async (amount: number) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

export const stripeService = { paymentIntent };
