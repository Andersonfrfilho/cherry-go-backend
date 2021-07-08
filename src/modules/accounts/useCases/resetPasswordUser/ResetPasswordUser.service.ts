import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { FORBIDDEN } from "@shared/errors/constants";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!user_token) {
      throw new AppError(FORBIDDEN.TOKEN_INVALID);
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError(FORBIDDEN.TOKEN_INVALID);
    }

    const password_hash = await this.hashProvider.generateHash(password);

    await this.usersRepository.updatePasswordUser({
      id: user_token.user_id,
      password_hash,
    });

    await this.usersTokensRepository.deleteById(user_token.id);
  }
}
export { ResetPasswordService };
