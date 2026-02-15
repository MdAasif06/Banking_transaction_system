import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAccount,getUserAccount,getAccountBalance } from "../controllers/account.controller.js";
const accountRouter = express.Router();

//routes account
accountRouter.post("/", authMiddleware, createAccount);
accountRouter.get("/",authMiddleware,getUserAccount)

accountRouter.get("/balance/:accountId",authMiddleware,getAccountBalance)

export default accountRouter;
