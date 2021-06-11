import { ErrorParametersDTO } from "@shared/errors/dtos";
import { HttpErrorCodesEnum } from "@shared/errors/enums";

export class AppError {
  public readonly message: string;
  public readonly status_code: number;
  public readonly code: string;

  constructor({
    message,
    status_code = HttpErrorCodesEnum.BAD_REQUEST,
    code = "",
  }: ErrorParametersDTO) {
    this.message = message;
    this.status_code = status_code;
    this.code = code;
  }
}
