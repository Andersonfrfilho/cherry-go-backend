import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing");
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, auth.secret.token) as IPayload;
    const {
      user: { id, active },
    } = JSON.parse(sub);

    if (!active) {
      throw new AppError("User is not active", 401);
    }

    request.user = {
      id,
    };

    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}
