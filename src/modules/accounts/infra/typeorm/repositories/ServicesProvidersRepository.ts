import { getRepository, In, Repository } from "typeorm";

import { CreateServiceProviderRepositoryDTO } from "@modules/accounts/dtos";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ServicesProvidersRepositoryInterface } from "@modules/accounts/repositories/ServicesProvidersRepository.interface";

export class ServicesProvidersRepository
  implements ServicesProvidersRepositoryInterface {
  private repository: Repository<Service>;

  constructor() {
    this.repository = getRepository(Service);
  }

  async create({
    active,
    provider_id,
    amount,
    duration,
    name,
  }: CreateServiceProviderRepositoryDTO): Promise<Service> {
    return this.repository.save({
      active,
      provider_id,
      amount,
      duration,
      name,
    });
  }

  async findByIdsActive(services_id: Partial<Service>[]): Promise<Service[]> {
    return this.repository.find({
      where: { id: In(services_id), active: true },
    });
  }
}
