import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.NOT_FOUND;

export const NOT_FOUND = {
  USER_DOES_NOT_EXIST: {
    message: "User does not exists!",
    status_code,
    code: "4001",
  },
  PROVIDER_DOES_NOT_EXIST: {
    message: "Provider does not exists!",
    status_code,
    code: "4002",
  },
  SERVICE_PROVIDER_DOES_NOT_EXIST: {
    message: "Service this provider does not exists!",
    status_code,
    code: "4003",
  },
  REFRESH_TOKEN_DOES_NOT_EXIST: {
    message: "Refresh Token does not exists!",
    status_code,
    code: "4004",
  },
  PHONE_DOES_NOT_EXIST: {
    message: "Phone does not exists!",
    status_code,
    code: "4005",
  },
};
