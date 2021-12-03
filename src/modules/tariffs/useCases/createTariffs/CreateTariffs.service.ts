import { inject, injectable } from "tsyringe";

import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { TariffsServicesRepositoryInterface } from "@modules/tariffs/repositories/TarifeService.repository.interface";
import { CacheProviderInterface } from "@shared/container/providers/CacheProvider/Cache.provider.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  percent: number;
  name: string;
  type: string;
}
@injectable()
export class CreateTariffsService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("TariffsServicesRepository")
    private tariffsServicesRepository: TariffsServicesRepositoryInterface,
    @inject("CacheProvider")
    private cacheProvider: CacheProviderInterface
  ) {}
  async execute({ user_id, percent, name, type }: ParamsDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    await this.tariffsServicesRepository.create({
      active: true,
      name,
      percent,
      type,
    });

    await this.cacheProvider.invalidate("tariffs");
  }
}
