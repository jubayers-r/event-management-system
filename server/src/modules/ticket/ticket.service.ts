import { prisma } from "../../lib/prisma";

const buyTicket = async (user_id: string, event_id: string) => {
  const event = await prisma.event.findUniqueOrThrow({
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
  return await prisma.$transaction(async (tx) => {
    await tx.ticket.upsert({
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

    await tx.event.update({
      where: { id: event_id },
      data: {
        people_capacity: {
          decrement: 1,
        },
      },
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

export const ticketService = { buyTicket, cancelTicket };
