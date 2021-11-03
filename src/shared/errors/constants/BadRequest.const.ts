import { config } from "@config/environment";
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
  PROVIDER_ALREADY_LIMITS_IMAGES: {
    message: `The provider already has the number of supported images (${config.providers.max_images_quantity})!`,
    status_code,
    code: "0005",
  },
  INITIAL_DATE_GREATER_THAN_END_DATE: {
    message: "Initial date greater than final date!",
    status_code,
    code: "0006",
  },
};
