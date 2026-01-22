import { prisma } from "../../lib/prisma";

const createEvent = async (payload: any, hostId: string) => {
  return await prisma.event.create({
    data: { ...payload, hostId },
  });
};
const getAllEvents = async () => {
  return await prisma.event.findMany();
};

const deleteEvent = async (userId: string, event_id: string) => {
  const eventInfo = await prisma.event.findUnique({
    where: {
      id: event_id,
    },
    select: {
      hostId: true,
    },
  });

  if (!eventInfo) {
    throw new Error("event doesnt exist");
  }

  if (eventInfo?.hostId !== userId) {
    throw new Error(
      "Unauthtorized access detected, you cannot delete this event, only the creator can",
    );
  }

  return await prisma.event.delete({
    where: {
      id: event_id,
    },
  });
};

export const eventService = { createEvent, getAllEvents, deleteEvent };
