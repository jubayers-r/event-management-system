import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const buyTicket = async (user_id: string, event_id: string) => {
  const event = await prisma.event.findUniqueOrThrow({
    where: {
      id: event_id,
    },
    select: {
      people_capacity: true,
      status: true,
      date_time: true,
      joining_fee: true,
    },
  });

  if (event.people_capacity < 1) throw new Error("SOLD_OUT");

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

  // if (user?.stripeCustomerId) {
  //   console.log(user.stripeCustomerId);
  // }

  return await prisma.$transaction(async (tx) => {
    // 1. Check & Lock Capacity inside transaction
    await tx.event.update({
      where: { id: event_id, people_capacity: { gt: 0 } },
      data: {
        people_capacity: {
          decrement: 1,
        },
      },
    });

    // 2. Create Ticket
    const newTicket = await tx.ticket.create({
      data: {
        user_id,
        event_id,
        amount: event.joining_fee,
        currency: "usd",
        status: "PENDING",
      },
    });
    // 3. Create Stripe Intent
    const intent = await stripe.paymentIntents.create({
      amount: event.joining_fee * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: newTicket.id,
      },
    });

    return {
      ticketId: newTicket.id,
      clientSecret: intent.client_secret,
      status: "PAYMENT_REQUIRED",
    };
  });
};

const cancelTicket = async (user_id: string, ticket_id: string) => {
  const isExist = await prisma.ticket.findFirst({
    where: {
      id: ticket_id,
      user_id,
      status: "PAID",
    },
    select: {
      event_id: true,
      status: true,
      paymentIntentId: true,
    },
  });


  if (!isExist) {
    throw new Error("Ticket not found or cannot be cancelled");
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
    await tx.ticket.update({
      where: {
        id: ticket_id,
      },
      data: {
        status: "CANCELLED",
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
    // Handle Stripe Refund if the ticket was already paid
    if (isExist.status === "PAID" && isExist.paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: isExist.paymentIntentId,
          reason: "requested_by_customer",
        });
      } catch (error) {
        // Log this specifically! If DB updates but Stripe fails,
        // you owe someone money manually.
        console.error("Stripe Refund Failed:", error);
        throw new Error("Refund failed, please contact support.");
      }
    }
  });
};

const handlePaymentFailure = async (orderId: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: orderId },
    select: { event_id: true, status: true },
  });

  // Only restore capacity if the ticket wasn't already processed
  if (ticket && ticket.status === "PENDING") {
    await prisma.$transaction([
      prisma.ticket.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      }),
      prisma.event.update({
        where: { id: ticket.event_id },
        data: { people_capacity: { increment: 1 } },
      }),
    ]);
  }
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

const getMyTickets = async (user_id: string) => {
  return await prisma.ticket.findMany({
    where: {
      user_id,
    },
  });
};

export const ticketService = {
  buyTicket,
  cancelTicket,
  paymentSuccessful,
  handlePaymentFailure,
  getMyTickets,
};
