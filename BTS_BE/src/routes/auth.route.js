import express from "express";
import { userRegister } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchmeValidate } from "../validations/auth.validation.js";
const router = express.Router();

router.post("/register", validate(registerSchmeValidate), userRegister);
export default router;
