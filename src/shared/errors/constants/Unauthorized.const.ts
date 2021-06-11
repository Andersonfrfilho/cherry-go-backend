import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.UNAUTHORIZED;

export const UNAUTHORIZED = {
  USER_PASSWORD_DOES_MATCH: {
    message: "User password does match",
    status_code,
  },
  TOKEN_EXPIRED: {
    message: "Token expired!",
    status_code,
  },
};
