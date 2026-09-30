import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import router from "./routes/routes";
import { ErrorMsg } from "./types/type";

require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));

app.use("/", router);

app.use(
  (
    error: ErrorMsg,
    req: Request,
    res: Response<{ error: string; type: string }>,
    next: NextFunction,
  ) => {
    console.log("Middleware error", error);
    const status: number = error.statusCode || 500;
    const message = error.message;
    const type = error.type as string;
    res.status(status).json({ error: message, type });
  },
);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(port, () => console.log("Server Start", port));
  })
  .catch(() => {});
