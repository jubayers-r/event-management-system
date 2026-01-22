import { prisma } from "../../lib/prisma";

const getMyBookings = async (user_id: string) => {
  return await prisma.ticket.findMany({
    where: {
      user_id,
    },
  });
};

export const userService = { getMyBookings };
