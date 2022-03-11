import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.CONFLICT;

export const CONFLICT = {
  USER_CLIENT_ALREADY_EXIST: {
    message: "User client already exist!",
    status_code,
    code: "9001",
  },
  TAG_ALREADY_EXIST: {
    message: "Tag already exist!",
    status_code,
    code: "9002",
  },
  TAG_CONFLICT_SOME_TAG_NO_EXIST: {
    message: "Tag conflict, some tag no longer exist!",
    status_code,
    code: "9003",
  },
  USER_ALREADY_HAS_A_LINKED_PHONE: {
    message: "user already has a linked phone!",
    status_code,
    code: "9004",
  },
};
