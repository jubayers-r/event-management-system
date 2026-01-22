import { prisma } from "../../lib/prisma";

const buyTicket = async (user_id: string, event_id: string) => {
  await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUniqueOrThrow({
      where: {
        id: event_id,
      },
      select: { people_capacity: true, status: true },
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

    await tx.event.update({
      where: { id: event_id },
      data: {
        people_capacity: {
          decrement: 1,
        },
      },
    });

    return await tx.ticket.upsert({
      where: { id: event_id },
      create: {
        user_id,
        event_id,
      },
      update: {
        user_id,
        event_id,
      },
    });
  });
};

export const ticketService = { buyTicket };
