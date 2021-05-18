import { HttpErrorCodes } from "@shared/enums/statusCode";

interface IErrorParameters {
  message: string;
  status_code?: number;
  code?: string;
}
export class AppError {
  public readonly message: string;
  public readonly status_code: number;
  public readonly code: string;

  constructor({
    message,
    status_code = HttpErrorCodes.BAD_REQUEST,
    code = "",
  }: IErrorParameters) {
    this.message = message;
    this.status_code = status_code;
    this.code = code;
  }
}
