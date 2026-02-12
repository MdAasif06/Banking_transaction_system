import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";


const app = express();

app.use(express.json());
app.use(cookieParser())

//routes
app.use("/api/auth", authRouter);


// Error middleware (ALWAYS LAST)
app.use(errorHandler);

export default app;
