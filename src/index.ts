import "dotenv/config";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import "reflect-metadata";
import { env } from "./config/env";
import { AppDataSource } from "./database";
import { startCleanupJob } from "./jobs/cleanup.job";
import routes from "./routes/v1";
import { errorHandler } from "./utils/error";

const app: Express = express();

app
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(helmet())

app.use("/api/v1", routes);

app.use(errorHandler);

// initialize DB first, then start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected ✅");

    startCleanupJob();

    app.listen(+env.port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });