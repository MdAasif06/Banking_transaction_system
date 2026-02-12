import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAccount } from "../controllers/account.controller.js";
const router = express.Router();

//routes account
router.post("/", authMiddleware, createAccount);

export default router;
