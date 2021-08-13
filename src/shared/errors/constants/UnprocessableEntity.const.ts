import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.UNPROCESSABLE_ENTITY;

export const UNPROCESSABLE_ENTITY = {
  CODE_INCORRECT: {
    message: "Code incorrect!",
    status_code,
    code: "220001",
  },
};
