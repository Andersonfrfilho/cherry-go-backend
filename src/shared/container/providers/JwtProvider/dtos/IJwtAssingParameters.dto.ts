import { Sub } from "@shared/container/providers/JwtProvider/dtos";

interface payload {
  email?: string;
}
interface options {
  subject: Partial<Sub> | string;
  expiresIn: string;
}
export interface IJwtAssignParametersDTO {
  payload: payload;
  secretOrPrivateKey: string;
  options: options;
}
