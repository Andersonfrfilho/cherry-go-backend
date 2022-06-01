import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

const status_code = HTTP_ERROR_CODES_ENUM.NOT_FOUND;

export const NOT_FOUND = {
  USER_DOES_NOT_EXIST: {
    message: "User does not exists!",
    status_code,
    code: "4001",
  },
  PROVIDER_DOES_NOT_EXIST: {
    message: "Provider does not exists!",
    status_code,
    code: "4002",
  },
  SERVICE_PROVIDER_DOES_NOT_EXIST: {
    message: "Service this provider does not exists!",
    status_code,
    code: "4003",
  },
  REFRESH_TOKEN_DOES_NOT_EXIST: {
    message: "Refresh Token does not exists!",
    status_code,
    code: "4004",
  },
  PHONE_DOES_NOT_EXIST: {
    message: "Phone does not exists!",
    status_code,
    code: "4005",
  },
  APPOINTMENT_DOES_NOT_EXIST: {
    message: "Appointment does not exists!",
    status_code,
    code: "4006",
  },
  APPOINTMENT_PROVIDER_DOES_NOT_EXIST: {
    message: "Appointment to provider does not exists!",
    status_code,
    code: "4007",
  },
  IMAGE_NOT_CONTAIN_FOR_PROVIDER: {
    message: "Image not found for provider!",
    status_code,
    code: "4008",
  },
  PERIOD_NOT_FOUND: {
    message: "Period not found!",
    status_code,
    code: "4009",
  },
  ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST: {
    message: "Account payment provider not exist!",
    status_code,
    code: "4010",
  },
  BANK_ISPB_DOES_NOT_EXIST: {
    message: "Bank ISPB not exist!",
    status_code,
    code: "4011",
  },
  BANK_DOES_NOT_EXIST: {
    message: "Bank not exist!",
    status_code,
    code: "4012",
  },
  CEP_NOT_FOUND: {
    message: "Cep not found!",
    status_code,
    code: "4013",
  },
  STRIPE_DETAILS_NOT_FOUND: {
    message: "Stripe details not found!",
    status_code,
    code: "4014",
  },
  DAY_NOT_FOUND: {
    message: "Day not found!",
    status_code,
    code: "4015",
  },
  PAYMENT_TYPES_NOT_FOUND: {
    message: "Payment types not found!",
    status_code,
    code: "4016",
  },
  STAGE_APPOINTMENT_NOT_FOUND: {
    message: "Stage appointment not found!",
    status_code,
    code: "4017",
  },
  PHONE_DOES_RECOVER: {
    message: "Phone does not recover!",
    status_code,
    code: "4018",
  },
};
