import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.NOT_FOUND;

export const NOT_FOUND = {
  USER_DOES_NOT_EXIST: {
    message: "User does not exists!",
    status_code,
  },
  PROVIDER_DOES_NOT_EXIST: {
    message: "Provider does not exists!",
    status_code,
  },
};
