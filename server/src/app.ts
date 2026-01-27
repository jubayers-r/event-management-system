import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { eventRoutes } from "./modules/event/event.route";
import { ticketRoutes } from "./modules/ticket/ticket.route";
import webhookStripe from "./lib/webhookStripe";

import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { chatRoutes } from "./modules/chat/chat.route";

const app: Application = express();

app.post(
  "/api/webhook",
  express.raw({
    type: "application/json",
  }),
  webhookStripe,
);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    // origin: "*",
    origin: [
      process.env.APP_URL!,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://10.0.20.135:5000",
      "http://10.0.20.135:3000",
    ],
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/chat", chatRoutes);

export default app;
