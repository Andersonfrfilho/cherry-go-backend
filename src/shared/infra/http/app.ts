import "reflect-metadata";
import "dotenv/config";
import { errors, CelebrateError } from "celebrate";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { AppError } from "@shared/errors/AppError";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums/StatusCode.enum";
import rateLimiter from "@shared/infra/http/middlewares/rateLimiter";
import createConnection from "@shared/infra/typeorm";

import { router } from "./routes";

import "@shared/container";

createConnection(process.env.ENVIRONMENT);
const app = express();

if (process.env.ENVIRONMENT === "production") {
  app.use(rateLimiter);
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

app.use(express.json());

app.use(cors());
app.use(router);
if (process.env.ENVIRONMENT === "production") {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errors());
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.status_code).json({
        status: "error",
        message: err.message,
        code: err.code,
      });
    }

    return response.status(HTTP_ERROR_CODES_ENUM.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: err.message,
      code: "50001",
    });
  }
);

export { app };
