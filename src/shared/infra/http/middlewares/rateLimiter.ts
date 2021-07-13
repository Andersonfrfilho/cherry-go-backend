import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "redis";

import { AppError } from "@shared/errors/AppError";
import { TOO_MANY_REQUESTS } from "@shared/errors/constants";
import { ENVIRONMENT_TYPES_ENUM } from "@shared/infra/http/enums/constants";

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (process.env.ENVIRONMENT === ENVIRONMENT_TYPES_ENUM.TEST) {
      const redisClient = redis.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        enable_offline_queue: false,
      });

      const limiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: "rateLimiter",
        points: 10,
        duration: 1,
      });
      await limiter.consume(request.ip);
    }
    return next();
  } catch (err) {
    throw new AppError(TOO_MANY_REQUESTS.TOO_MANY_REQUESTS);
  }
}
