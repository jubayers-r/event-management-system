import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// Use a generic type import to satisfy the compiler for now
// import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";
import { UserRole } from "../middleware/authorization";

// Create a dummy object or cast to satisfy the adapter
// const prisma = {} as PrismaClient;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // replace with your provider
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: UserRole.USER,
      },
      attendingEventId: {
        type: "string",
        required: false,
      },
      stripeCustomerId: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
});
