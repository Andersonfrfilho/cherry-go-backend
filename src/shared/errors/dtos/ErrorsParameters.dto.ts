import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

export interface ErrorParametersDTO {
  message: string;
  status_code?: HTTP_ERROR_CODES_ENUM;
  code?: string;
}
