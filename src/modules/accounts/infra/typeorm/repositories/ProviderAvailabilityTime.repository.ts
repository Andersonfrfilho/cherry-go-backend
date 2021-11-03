import { classToClass } from "class-transformer";
import { getRepository, In, Repository } from "typeorm";

import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProvidersAvailabilityTimeRepositoryInterface } from "@modules/accounts/repositories/ProviderAvailabilityTime.repository.interface";

export class ProvidersAvailabilityTimeRepository
  implements ProvidersAvailabilityTimeRepositoryInterface {
  private repository: Repository<ProviderAvailabilityTime>;

  constructor() {
    this.repository = getRepository(ProviderAvailabilityTime);
  }
  async findById(id: string): Promise<ProviderAvailabilityTime> {
    return this.repository.findOne(id);
  }
}
