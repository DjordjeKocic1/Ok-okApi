import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import router from "./routes/auth";

require("dotenv").config();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));

app.use("/", router);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(port, () => console.log("Server Start", port));
  })
  .catch(() => {});
