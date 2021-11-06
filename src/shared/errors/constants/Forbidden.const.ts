import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.FORBIDDEN;

export const FORBIDDEN = {
  TOKEN_INVALID: {
    message: "Token invalid!",
    status_code,
    code: "3001",
  },
  USER_IS_NOT_ACTIVE: {
    message: "User is not active!",
    status_code,
    code: "3002",
  },
  PROVIDER_IS_NOT_ACTIVE: {
    message: "Provider is not active!",
    status_code,
    code: "3003",
  },
  INSIDE_IS_NOT_ACTIVE: {
    message: "Inside is not active!",
    status_code,
    code: "3004",
  },
  ADMIN_IS_NOT_ACTIVE: {
    message: "admin is not active!",
    status_code,
    code: "3005",
  },
  PHONE_BELONGS_TO_ANOTHER_USER: {
    message: "Phone belongs to another user",
    status_code,
    code: "3006",
  },
  PERIOD_BELONGS_TO_ANOTHER_PROVIDER: {
    message: "Period belongs to another provider",
    status_code,
    code: "3007",
  },
  LOCALS_BELONGS_TO_ANOTHER_PROVIDER: {
    message: "Locas belongs to another provider",
    status_code,
    code: "3008",
  },
};
