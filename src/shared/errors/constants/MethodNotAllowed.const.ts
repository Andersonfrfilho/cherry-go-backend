import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.METHOD_NOT_ALLOWED;

export const METHOD_NOT_ALLOWED = {
  NOT_ALLOWED: {
    message: "Not Allowed!",
    status_code,
    code: "5001",
  },
};
