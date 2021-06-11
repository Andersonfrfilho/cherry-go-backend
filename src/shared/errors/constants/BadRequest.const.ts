import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.BAD_REQUEST;

export const BAD_REQUEST = {
  USER_NOT_EXIST: {
    message: "User does not exist!",
    status_code,
  },
};
