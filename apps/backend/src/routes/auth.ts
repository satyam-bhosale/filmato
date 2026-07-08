import auth from "@filmato/backend/lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";

const authRouter = Router();

authRouter.all('*splat', toNodeHandler(auth));

export default authRouter;