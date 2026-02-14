import express from "express";
import { authMiddleware,authSystemUserMiddleware } from "../middlewares/auth.middleware.js";
import { createTransaction,createInitialFoundsTransaction } from "../controllers/transaction.controller.js";
const TransactionRouter = express.Router();

TransactionRouter.post("/", authMiddleware, createTransaction);
TransactionRouter.post("/system/initial-found",authSystemUserMiddleware,createInitialFoundsTransaction)

export default TransactionRouter;
