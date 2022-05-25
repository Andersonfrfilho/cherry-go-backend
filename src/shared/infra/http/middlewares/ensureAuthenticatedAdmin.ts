import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import { config } from "@config/environment";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticatedAdmin(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;
  const { auth } = config;
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
    user: { id, active, types },
  } = JSON.parse(sub);

  if (!active) {
    throw new AppError(FORBIDDEN.USER_IS_NOT_ACTIVE);
  }

  if (!types.some((type) => type.name === USER_TYPES_ENUM.ADMIN)) {
    throw new AppError(FORBIDDEN.ADMIN_IS_NOT_ACTIVE);
  }

  request.user = {
    id,
  };

  return next();
}
