import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const buyTicket = async (user_id: string, event_id: string) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: {
      id: event_id,
      people_capacity: { gt: 0 },
    },
    select: {
      people_capacity: true,
      status: true,
      date_time: true,
      joining_fee: true,
    },
  });

  if (!event) {
    throw new Error("The event does not exist");
  }

  if (event.status === "DRAFT") {
    throw new Error("The event is not public yet");
  }

  if (event.people_capacity < 1 || event.status === "BOOKED") {
    throw new Error("Event is sold out");
  }

  if (event.date_time.getTime() <= Date.now()) {
    throw new Error("Event ticket is no more avilable");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (user?.stripeCustomerId) {
   console.log( user.stripeCustomerId);
  }

  return await prisma.$transaction(async (tx) => {
    const newTicket = await tx.ticket.create({
      data: {
        user_id,
        event_id,
        amount: event.joining_fee,
        currency: "usd",
        status: "PENDING",
      },
    });

    const intite = await stripe.paymentIntents.create({
      amount: event.joining_fee * 100,

      currency: "usd",
      // for testing
      // confirmation_method: "manual",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        orderId: newTicket.id,
      },
      //for testing
      confirm: false,
    });

    await tx.event.update({
      where: { id: event_id, people_capacity: { gt: 0 } },
      data: {
        people_capacity: {
          decrement: 1,
        },
      },
    });
    // for testing purpose onmly
    await stripe.paymentIntents.confirm(intite.id, {
      payment_method: "pm_card_visa",
    });
  });
};

const cancelTicket = async (user_id: string, ticket_id: string) => {
  const isExist = await prisma.ticket.findFirst({
    where: {
      id: ticket_id,
      user_id,
    },
    select: {
      event_id: true,
    },
  });

  if (!isExist) {
    throw new Error("user didnt bought the ticket");
  }

  const eventInfo = await prisma.event.findFirst({
    where: {
      id: isExist.event_id,
    },
    select: {
      status: true,
      date_time: true,
    },
  });

  if (
    eventInfo?.status !== "ACTIVE" ||
    eventInfo.date_time.getTime() <= Date.now()
  ) {
    throw new Error("event already going on or passed");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.ticket.delete({
      where: {
        id: ticket_id,
      },
    });

    await tx.event.update({
      where: { id: isExist.event_id },
      data: {
        people_capacity: {
          increment: 1,
        },
      },
    });
  });
};

const paymentSuccessful = async (
  orderId: string,
  payment_intent_id: string,
) => {
  await prisma.ticket.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentIntentId: payment_intent_id,
    },
  });
};

export const ticketService = { buyTicket, cancelTicket, paymentSuccessful };
