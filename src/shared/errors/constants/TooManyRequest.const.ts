import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.TOO_MANY_REQUESTS;

export const TOO_MANY_REQUESTS = {
  TOO_MANY_REQUESTS: {
    message: "Too many requests!",
    status_code,
  },
};
