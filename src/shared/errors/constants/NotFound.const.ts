import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.NOT_FOUND;

export const NOT_FOUND = {
  USER_DOES_NOT_EXIST: {
    message: "User does not exists!",
    status_code,
  },
  PROVIDER_DOES_NOT_EXIST: {
    message: "Provider does not exists!",
    status_code,
  },
  SERVICE_PROVIDER_DOES_NOT_EXIST: {
    message: "Service this provider does not exists!",
    status_code,
  },
  USER_NOT_EXIST: {
    message: "User does not exist!",
    status_code,
  },
  PROVIDER_NOT_EXIST: {
    message: "Provider does not exist!",
    status_code,
  },
};
