import { prisma } from "../../lib/prisma";

const createEvent = async (payload: any) => {
  return await prisma.event.create({
    data: { ...payload },
  });
};
const getAllEvents = async () => {
  return await prisma.event.findMany();
};

export const eventService = { createEvent, getAllEvents };
