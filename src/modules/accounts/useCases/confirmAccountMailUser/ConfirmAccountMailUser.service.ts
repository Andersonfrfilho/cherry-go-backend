import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from "@shared/errors/constants";

@injectable()
class ConfirmAccountMailUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute(token: string): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!user_token) {
      throw new AppError(NOT_FOUND.REFRESH_TOKEN_DOES_NOT_EXIST);
    }

    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError(UNAUTHORIZED.TOKEN_EXPIRED);
    }

    await this.usersRepository.updateActiveUser({
      id: user_token.user_id,
      active: true,
    });

    const user = await this.usersRepository.findById(user_token.user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (!user.details.stripe.customer.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    await this.paymentProvider.updateAccountClient({
      stripe_id: user.details.stripe.customer.id,
      email: user.email,
    });
  }
}
export { ConfirmAccountMailUserService };
