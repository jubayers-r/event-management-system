import { prisma } from "../../lib/prisma";

const createEvent = async (payload: any, hostId: string) => {
  const result = await prisma.event.create({
    data: { ...payload, hostId },
  });

  await prisma.user.updateMany({
    where: {
      id: hostId,
      role: {
        notIn: ["HOST", "MANAGER"],
      },
    },
    data: {
      role: "HOST",
    },
  });

  return result;
};
const getAllEvents = async () => {
  return await prisma.event.findMany({
    where: {
      status: "ACTIVE",
    },
  });
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

const publishEvent = async (userId: string, event_id: string) => {
  const eventInfo = await prisma.event.findUnique({
    where: {
      id: event_id,
    },
    select: {
      status: true,
      attendees: true,
    },
  });

  if (eventInfo?.status === "ACTIVE") {
    throw new Error("Event is already active");
  }

  return await prisma.event.update({
    where: {
      id: event_id,
    },
    data: {
      status: "ACTIVE",
    },
  });
};

export const eventService = {
  createEvent,
  getAllEvents,
  deleteEvent,
  publishEvent,
};
