import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

import { config } from "@config/environment";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { TarifeService } from "@modules/tariffs/infra/typeorm/entities/TariffsServices";
import { TariffsServicesRepositoryInterface } from "@modules/tariffs/repositories/TarifeService.repository.interface";
import { AppError } from "@shared/errors/AppError";
import { NOT_FOUND } from "@shared/errors/constants";

interface ParamsDTO {
  user_id: string;
  tariff_type: string;
}
@injectable()
export class GetSpecifiesTariffsServices {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("TariffsServicesRepository")
    private tariffsServicesRepository: TariffsServicesRepositoryInterface
  ) {}
  async execute({ tariff_type, user_id }: ParamsDTO): Promise<TarifeService[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(NOT_FOUND.USER_DOES_NOT_EXIST);
    }

    const tariffs_founds = await this.tariffsServicesRepository.getSpecificsTariffs(
      tariff_type
    );

    return tariffs_founds;
  }
}
