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
  ACCOUNT_NUMBERS_EXCEEDED: {
    message: "Account numbers exceeded!",
    status_code,
    code: "0007",
  },
  ACCOUNT_NUMBERS_MINIMAL_FOR_EXCLUSION: {
    message:
      "the number of for deletion are two accounts add one to be able to delete the main one!",
    status_code,
    code: "0008",
  },
  ACCOUNT_NOT_RATING_IN_SAME_ACCOUNT: {
    message: "the account not rating same account provider!",
    status_code,
    code: "0009",
  },
  DAY_NOT_AVAILABLE: {
    message: "day not available!",
    status_code,
    code: "0010",
  },
  APPOINTMENT_INITIAL_DATE_BEFORE_DATE_NOW: {
    message: "Appointment with date start before date now!",
    status_code,
    code: "0012",
  },
  PROVIDER_LOCAL_TYPE_NOT_AVAILABLE: {
    message: "Provider local type not available!",
    status_code,
    code: "0013",
  },
  PROVIDER_LOCAL_NOT_AVAILABLE: {
    message: "Provider local not available!",
    status_code,
    code: "0014",
  },
  PROVIDER_TRANSPORT_TYPE_NOT_AVAILABLE: {
    message: "Provider transport type not available!",
    status_code,
    code: "0015",
  },
  PROVIDER_TRANSPORT_NOT_AVAILABLE: {
    message: "Provider transport not available!",
    status_code,
    code: "0016",
  },
  PROVIDER_PAYMENT_TYPE_NOT_AVAILABLE: {
    message: "Provider payment not available!",
    status_code,
    code: "0017",
  },
  PROVIDER_HOUR_PERIOD_NOT_AVAILABLE: {
    message: "Provider hour period not available!",
    status_code,
    code: "0018",
  },
};
