import { ErrorParametersDTO } from "@shared/errors/dtos";
import { HTTP_ERROR_CODES_ENUM } from "@shared/errors/enums";

export class AppError {
  public readonly message: string;
  public readonly status_code: number;
  public readonly code: string;

  constructor({
    message,
    status_code = HTTP_ERROR_CODES_ENUM.BAD_REQUEST,
    code = "",
  }: ErrorParametersDTO) {
    this.message = message;
    this.status_code = status_code;
    this.code = code;
  }
}
