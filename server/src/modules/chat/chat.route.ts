import { Router } from "express";
import authorization from "../../middleware/authorization";
import { chatControllers } from "./chat.controller";

const router = Router();

router.get("/:ticketId", authorization(), chatControllers.getChats);


export const chatRoutes = router;
