import { HttpErrorCodesEnum } from "@shared/errors/enums";

const status_code = HttpErrorCodesEnum.CONFLICT;

export const CONFLICT = {
  USER_CLIENT_ALREADY_EXIST: {
    message: "User client already exist!",
    status_code,
  },
  TAG_ALREADY_EXIST: {
    message: "Tag already exist!",
    status_code,
  },
};
