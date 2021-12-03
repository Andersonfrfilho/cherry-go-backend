import { inject, injectable } from "tsyringe";

import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProviderLocalType } from "@modules/accounts/infra/typeorm/entities/ProviderLocalType";
import { ProvidersRepositoryInterface } from "@modules/accounts/repositories/Providers.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AddressProviderInterface } from "@shared/container/providers/AddressProvider/Address.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  cep: string;
}

@injectable()
export class GetCepService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("AddressProvider")
    private addressProvider: AddressProviderInterface
  ) {}
  async execute({ user_id, cep }: ParamsDTO): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const cep_found = await this.addressProvider.getAddressByCep(cep);

    if (cep_found.zipcode === "") {
      throw new AppError(NOT_FOUND.CEP_NOT_FOUND);
    }

    return cep_found;
  }
}
