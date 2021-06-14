import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UserTypesEnum } from "@modules/accounts/enums/UserTypes.enum";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN, UNAUTHORIZED } from "@shared/errors/constants";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticatedProvider(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError(UNAUTHORIZED.TOKEN_IS_MISSING);
  }

  const [, token] = authHeader.split(" ");

  const { sub } = verify(token, auth.secret.token) as IPayload;
  const {
    user: { id, active, types },
  } = JSON.parse(sub);

  if (!active) {
    throw new AppError(FORBIDDEN.USER_IS_NOT_ACTIVE);
  }

  if (types.some((type) => type.name === UserTypesEnum.PROVIDER)) {
    throw new AppError(FORBIDDEN.USER_IS_NOT_ACTIVE);
  }

  request.user = {
    id,
  };

  return next();
}
