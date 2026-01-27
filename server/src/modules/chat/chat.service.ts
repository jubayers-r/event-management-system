import { prisma } from "../../lib/prisma";

const getMessages = async (ticketId: string) => {
  return await prisma.message.findMany({
    where: {
      ticketId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      ticket: {
        select: {
          event: {
            select: {
              hostId: true,
            },
          },
        },
      },
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const charServices = { getMessages };
