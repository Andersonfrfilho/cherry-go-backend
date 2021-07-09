import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.BAD_REQUEST;

export const BAD_REQUEST = {
  TRANSACTION_INVALID: {
    message: "Transaction Invalid!",
    status_code,
  },
};
