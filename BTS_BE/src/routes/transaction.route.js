import {Router} from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";
const TransactionRouter = Router();

TransactionRouter.post("/", authMiddleware, createTransaction);
TransactionRouter.post("/system/initial-found",authMiddleware,createTransaction)

export default TransactionRouter;
