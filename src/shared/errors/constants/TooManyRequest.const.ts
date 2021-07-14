import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.TOO_MANY_REQUESTS;

export const TOO_MANY_REQUESTS = {
  TOO_MANY_REQUESTS: {
    message: "Too many requests!",
    status_code,
  },
};
