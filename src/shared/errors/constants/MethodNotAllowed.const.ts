import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.METHOD_NOT_ALLOWED;

export const METHOD_NOT_ALLOWED = {
  NOT_ALLOWED: {
    message: "Not Allowed!",
    status_code,
  },
};
