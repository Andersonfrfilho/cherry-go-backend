import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";
import { AppError } from "@shared/errors/AppError";

interface IResponse {
  user: {
    email: string;
  };
  token: string;
  refresh_token: string;
}
interface IRequest {
  email: string;
  password: string;
}
@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const { expires_in, secret } = auth;

    if (!user) {
      throw new AppError("User not exist");
    }

    const passwordHash = await this.hashProvider.compareHash(
      password,
      user.password_hash
    );

    if (!passwordHash) {
      throw new AppError("User password does match");
    }

    const token = sign({}, secret.token, {
      subject: JSON.stringify({ user: { id: user.id, active: user.active } }),
      expiresIn: expires_in.token,
    });

    const refresh_token = sign({ email }, secret.refresh, {
      subject: JSON.stringify({ user: { id: user.id, active: user.active } }),
      expiresIn: expires_in.refresh,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_in.refresh_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: refresh_token_expires_date,
      refresh_token,
    });

    return {
      user,
      token,
      refresh_token,
    };
  }
}
export { AuthenticateUserUseCase };
