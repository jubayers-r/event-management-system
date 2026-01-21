import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// Use a generic type import to satisfy the compiler for now
// import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

// Create a dummy object or cast to satisfy the adapter
// const prisma = {} as PrismaClient;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // replace with your provider
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
});
