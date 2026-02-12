import express from "express";
import { userRegister,userLogin } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchmeValidate,loginSchemaValidate } from "../validations/auth.validation.js";
const router = express.Router();

//register route
router.post("/register", validate(registerSchmeValidate), userRegister);

//login route
router.post("/login",validate(loginSchemaValidate),userLogin)
export default router;
