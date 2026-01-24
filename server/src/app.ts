import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { eventRoutes } from "./modules/event/event.route";
import { ticketRoutes } from "./modules/ticket/ticket.route";
import webhookStripe from "./lib/webhookStripe";
import { createChat } from "./modules/chat/chat.controller";
import authorization from "./middleware/authorization";

const app: Application = express();

app.post(
  "/api/webhook",
  express.raw({
    type: "application/json",
  }),
  webhookStripe,
);

app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.APP_URL!,
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/event", eventRoutes);
app.use("/api/ticket", ticketRoutes);
app.post("/api/chat", authorization(), createChat);

export default app;
