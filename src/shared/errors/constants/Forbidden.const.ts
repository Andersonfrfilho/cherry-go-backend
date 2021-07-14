import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.FORBIDDEN;

export const FORBIDDEN = {
  TOKEN_INVALID: {
    message: "Token invalid!",
    status_code,
  },
  REFRESH_TOKEN_DOES_NOT_EXIST: {
    message: "Refresh Token does not exists!",
    status_code,
  },
  USER_IS_NOT_ACTIVE: {
    message: "User is not active!",
    status_code,
  },
  PROVIDER_IS_NOT_ACTIVE: {
    message: "Provider is not active!",
    status_code,
  },
  INSIDER_IS_NOT_ACTIVE: {
    message: "Insider is not active!",
    status_code,
  },
  ADMIN_IS_NOT_ACTIVE: {
    message: "admin is not active!",
    status_code,
  },
};
