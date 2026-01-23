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
  // 1. Fetch the requester's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // 2. Define the deletion criteria
  // If ADMIN, delete by ID only. If not, delete by ID + hostId.
  const deleteCriteria =
    user?.role === "MANAGER"
      ? { id: event_id }
      : { id: event_id, hostId: userId };

  try {
    return await prisma.event.delete({
      where: deleteCriteria,
    });
  } catch (error: any) {
    // P2025 = Record not found (either ID is wrong or hostId didn't match)
    if (error.code === "P2025") {
      throw new Error("Unauthorized or Event not found");
    }
    throw error;
  }
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
