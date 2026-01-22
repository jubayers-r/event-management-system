import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { eventRoutes } from "./modules/event/event.route";
import { ticketRoutes } from "./modules/ticket/ticket.route";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/event", eventRoutes);
app.use("/api/ticket", ticketRoutes);

export default app;
