import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";

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
    throw new AppError(UNAUTHORIZED.TOKEN_IS_MISSING);
  }

  const [, token] = authHeader.split(" ");

  try {
    verify(token, auth.secret.token);
  } catch (err) {
    throw new AppError(UNAUTHORIZED.TOKEN_IS_INVALID);
  }
  const { sub } = verify(token, auth.secret.token) as IPayload;

  const {
    user: { id, active },
  } = JSON.parse(sub);

  if (!active) {
    throw new AppError(FORBIDDEN.USER_IS_NOT_ACTIVE);
  }

  request.user = {
    id,
  };

  return next();
}
