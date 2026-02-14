import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import accountRouter from "./routes/account.route.js";
import TransactionRouter from "./routes/transaction.route.js"
const app = express();

app.use(express.json());
app.use(cookieParser());
// 👇 YAHAN ADD KARO
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});



//routes
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transaction",TransactionRouter)

// Error middleware (ALWAYS LAST)
app.use(errorHandler);

export default app;
