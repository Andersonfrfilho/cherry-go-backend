import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import {
  ConfirmAccountPhoneUserServiceDTO,
  CreateUserPhonesClientServiceRequestDTO,
} from "@modules/accounts/dtos";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/Phones.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { UsersTokensRepositoryInterface } from "@modules/accounts/repositories/UsersTokens.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { CLIENT_PHONE_CACHE_KEY } from "@shared/container/providers/CacheProvider/keys/keys.const";
import { DateProviderInterface } from "@shared/container/providers/DateProvider/Date.provider.interface";
import { HashProviderInterface } from "@shared/container/providers/HashProvider/Hash.provider.interface";
import { JwtProviderInterface } from "@shared/container/providers/JwtProvider/Jwt.provider.interface";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import {
  FORBIDDEN,
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
    @inject("PhonesRepository")
    private phonesRepository: PhonesRepositoryInterface,
    @inject("DateProvider")
    private dateProvider: DateProviderInterface,
    @inject("JwtProvider")
    private jwtProvider: JwtProviderInterface,
    @inject("HashProvider")
    private hashProvider: HashProviderInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({
    code,
    token,
    user_id,
  }: ConfirmAccountPhoneUserServiceDTO): Promise<void> {
    const { auth } = config;
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
    const user = await this.usersRepository.findById(user_id);
    const key = CLIENT_PHONE_CACHE_KEY(user.id);
    const phone = await this.cacheProvider.recover<
      Partial<CreateUserPhonesClientServiceRequestDTO>
    >(key);
    if (!phone) {
      throw new AppError(NOT_FOUND.PHONE_DOES_RECOVER);
    }
    const { country_code, ddd, number } = phone;
    const phone_exist = await this.phonesRepository.findPhoneUser({
      ddd,
      country_code,
      number,
    });
    if (phone_exist && phone_exist.users[0].id) {
      throw new AppError(FORBIDDEN.PHONE_BELONGS_TO_ANOTHER_USER);
    }
    await this.usersRepository.createUserPhones({
      id: user_id,
      country_code,
      number,
      ddd,
      active: true,
    });
    if (!user.details.stripe.customer.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }
    await this.paymentProvider.updateAccountClient({
      external_id: user.details.stripe.customer.id,
      phone: `${country_code}${ddd}${number}`,
    });
    if (user?.details?.stripe?.account?.id) {
      await this.paymentProvider.updateAccount({
        external_id: user.details.stripe.account.id,
        business_profile: {
          support_phone: `${country_code}${ddd}${number}`,
        },
      });
    }
  }
}
export { ConfirmAccountPhoneUserService };
