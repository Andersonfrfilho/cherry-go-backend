import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.FORBIDDEN;

export const FORBIDDEN = {
  TOKEN_INVALID: {
    message: "Token invalid!",
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
  INSIDE_IS_NOT_ACTIVE: {
    message: "Inside is not active!",
    status_code,
  },
  ADMIN_IS_NOT_ACTIVE: {
    message: "admin is not active!",
    status_code,
  },
  PHONE_BELONGS_TO_ANOTHER_USER: {
    message: "Phone belongs to another user",
    status_code,
  },
};
