import { inject, injectable } from "tsyringe";

import { CreateUserAddressClientServiceDTO } from "@modules/accounts/dtos";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { User } from "@sentry/node";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

@injectable()
export class CreateUserAddressClientService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    user_id,
    city,
    country,
    district,
    number,
    state,
    street,
    zipcode,
  }: CreateUserAddressClientServiceDTO): Promise<User> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const user = await this.usersRepository.createUserAddress({
      user: user_exist,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
    });

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (!user.details.stripe.customer.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    const address = {
      city,
      country: "BR",
      line1: street,
      line2: number,
      postal_code: zipcode,
      state,
    };

    await this.paymentProvider.updateAccountClient({
      stripe_id: user.details.stripe.customer.id,
      address,
    });
    return user;
  }
}
