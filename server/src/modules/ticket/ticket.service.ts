import { prisma } from "../../lib/prisma";

const buyTicket = async (user_id: string, event_id: string) => {
  await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: {
        id: event_id,
      },
      select: { people_capacity: true },
    });

    if (!event || event.people_capacity < 1) {
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
