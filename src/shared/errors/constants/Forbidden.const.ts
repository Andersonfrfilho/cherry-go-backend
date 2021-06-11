import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.FORBIDDEN;

export const FORBIDDEN = {
  TOKEN_INVALID: {
    message: "Token invalid!",
    status_code,
  },
};
