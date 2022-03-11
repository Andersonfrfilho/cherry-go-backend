import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { ConfirmAccountPhoneUserServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import {
  METHOD_NOT_ALLOWED,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "@shared/errors/constants";

@injectable()
class ConfirmAccountPhoneUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    code,
    token,
    user_id,
  }: ConfirmAccountPhoneUserServiceDTO): Promise<void> {
    const user_token = await this.usersTokensRepository.findByRefreshToken(
      token
    );
    const { sub } = this.jwtProvider.verifyJwt({
      auth_secret: auth.secret.refresh,
      token: user_token.refresh_token,
    });
    if (!(user_id === sub.user.id)) {
      throw new AppError(METHOD_NOT_ALLOWED.NOT_ALLOWED);
    }
    if (
      this.dateProvider.compareIfBefore(user_token.expires_date, new Date())
    ) {
      throw new AppError(UNAUTHORIZED.TOKEN_EXPIRED);
    }
    await this.usersTokensRepository.deleteById(user_token.id);

    const passed = await this.hashProvider.compareHash(code, sub.code_hash);

    if (!passed) {
      throw new AppError(UNPROCESSABLE_ENTITY.CODE_INCORRECT);
    }
    await this.usersRepository.updateActivePhoneUser({
      id: sub.user.id,
      active: passed,
    });
    const user = await this.usersRepository.findById(user_token.user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (!user.details.stripe.customer.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    await this.paymentProvider.updateAccountClient({
      external_id: user.details.stripe.customer.id,
      phone: `${user.phones[0].phone.country_code}${user.phones[0].phone.ddd}${user.phones[0].phone.number}`,
    });

    if (user?.details?.stripe?.account?.id) {
      await this.paymentProvider.updateAccount({
        external_id: user.details.stripe.account.id,
        business_profile: {
          support_phone: `${user.phones[0].phone.country_code}${user.phones[0].phone.ddd}${user.phones[0].phone.number}`,
        },
      });
    }
  }
}
export { ConfirmAccountPhoneUserService };
