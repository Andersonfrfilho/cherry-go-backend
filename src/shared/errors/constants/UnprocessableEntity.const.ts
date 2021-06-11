import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.UNPROCESSABLE_ENTITY;

export const UNPROCESSABLE_ENTITY = {
  CODE_INCORRECT: {
    message: "Code incorrect!",
    status_code,
  },
};
