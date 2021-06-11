import { HttpErrorCodesEnum } from "@shared/errors/enums";

export interface ErrorParametersDTO {
  message: string;
  status_code?: HttpErrorCodesEnum;
  code?: string;
}
