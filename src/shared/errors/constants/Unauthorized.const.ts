import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.UNAUTHORIZED;

export const UNAUTHORIZED = {
  USER_PASSWORD_DOES_MATCH: {
    message: "User password does match",
    status_code,
  },
  PROVIDER_PASSWORD_DOES_MATCH: {
    message: "User password does match",
    status_code,
  },
  TOKEN_EXPIRED: {
    message: "Token expired!",
    status_code,
  },
  TOKEN_IS_MISSING: {
    message: "Token is missing!",
    status_code,
  },
  TOKEN_IS_INVALID: {
    message: "Token is invalid!",
    status_code,
  },
};
