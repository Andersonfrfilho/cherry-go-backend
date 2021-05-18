import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { HttpErrorCodes } from "@shared/enums/statusCode";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError({
      message: "token is missing",
      status_code: HttpErrorCodes.UNAUTHORIZED,
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, auth.secret.token) as IPayload;
    const {
      user: { id, active },
    } = JSON.parse(sub);

    if (!active) {
      throw new AppError({
        message: "User is not active",
        status_code: HttpErrorCodes.FORBIDDEN,
      });
    }

    request.user = {
      id,
    };

    return next();
  } catch {
    throw new AppError({
      message: "Invalid token",
      status_code: HttpErrorCodes.UNAUTHORIZED,
    });
  }
}
