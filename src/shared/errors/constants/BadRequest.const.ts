import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.BAD_REQUEST;

export const BAD_REQUEST = {
  TRANSACTION_INVALID: {
    message: "Transaction Invalid!",
    status_code,
  },
};
