import { getRepository, Repository } from "typeorm";

import { CreateTariffsRepositoryDTO } from "@modules/tariffs/dtos/repositories/CreateTarifs.repository.dto";
import { TariffsServicesRepositoryInterface } from "@modules/tariffs/repositories/TarifeService.repository.interface";

import { TarifeService } from "../entities/TariffsServices";

export class TariffsServicesRepository
  implements TariffsServicesRepositoryInterface {
  private repository: Repository<TarifeService>;

  constructor() {
    this.repository = getRepository(TarifeService);
  }
  async getSpecificsTariffs(type: string): Promise<TarifeService[]> {
    const tariffs = await this.repository.find({ where: { type } });
    return tariffs;
  }

  async getAllTariffs(): Promise<TarifeService[]> {
    return this.repository.find();
  }

  async create({
    name,
    percent,
    active,
  }: CreateTariffsRepositoryDTO): Promise<TarifeService> {
    const tarife = await this.repository.save({
      name,
      percent,
      active,
    });

    return this.repository.create(tarife);
  }
}
