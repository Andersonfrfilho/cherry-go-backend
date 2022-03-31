import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { CreateUserAddressClientServiceDTO } from "@modules/accounts/dtos";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { NATIONALITY_ISO_3166_2_ENUM } from "@shared/container/providers/PaymentProvider/enums/stripe.enums";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { CONFLICT, NOT_FOUND } from "@shared/errors/constants";

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
    complement,
    latitude,
    longitude,
    reference,
  }: CreateUserAddressClientServiceDTO): Promise<User> {
    const user_exist = await this.usersRepository.findById(user_id);

    if (!user_exist) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    if (user_exist.addresses && user_exist.addresses.length > 0) {
      throw new AppError(CONFLICT.USER_ALREADY_HAS_A_LINKED_ADDRESS);
    }

    await this.usersRepository.createUserAddress({
      user: user_exist,
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
      complement,
      latitude,
      longitude,
      reference,
    });

    if (!user_exist.details.stripe.customer.id) {
      throw new AppError(NOT_FOUND.ACCOUNT_PAYMENT_PROVIDER_DOES_NOT_EXIST);
    }

    const address = {
      city,
      country: NATIONALITY_ISO_3166_2_ENUM.BR,
      line1: street,
      line2: number,
      postal_code: zipcode,
      state,
    };

    await this.paymentProvider.updateAccountClient({
      external_id: user_exist.details.stripe.customer.id,
      address,
    });

    if (user_exist.details?.stripe?.account?.id) {
      await this.paymentProvider.updateAccount({
        external_id: user_exist.details.stripe.account.id,
        company: { address },
      });
    }

    const user_found = await this.usersRepository.findById(user_id);

    return instanceToInstance(user_found);
  }
}
