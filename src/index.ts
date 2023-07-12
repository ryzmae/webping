import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

import { Logger } from "./utils/Logger";
import authRouter from "./routes/authentication";
import monitorRouter from "./routes/monitors";

const logger: any = new Logger({
  info: true,
  error: true,
  warn: true,
  debug: true,
});

const app: Express = express();
const server: http.Server = http.createServer(app);

const mongo: string | any =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1";
const port: number = Number(process.env.PORT) || 3000;

mongoose
  .connect(mongo)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err: Error) => logger.error(err));

app.use(
  cors({
    credentials: true,
  }),
);

app.use(bodyParser.json());

// routes
app.use("/auth", authRouter);
app.use("/monitors", monitorRouter);

server.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});
