import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.BAD_REQUEST;

export const BAD_REQUEST = {
  TRANSACTION_INVALID: {
    message: "Transaction Invalid!",
    status_code,
    code: "0001",
  },
  APPOINTMENT_HAS_PASSED_THE_DATE: {
    message: "Appointment has passed the date!",
    status_code,
    code: "0002",
  },
  APPOINTMENT_ALREADY_REJECTED: {
    message: "Appointment already rejected!",
    status_code,
    code: "0003",
  },
  APPOINTMENT_ALREADY_ACCEPTED: {
    message: "Appointment already accepted!",
    status_code,
    code: "0004",
  },
};
