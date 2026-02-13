import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAccount } from "../controllers/account.controller.js";
const accountRouter = express.Router();

//routes account
accountRouter.post("/", authMiddleware, createAccount);

export default accountRouter;
