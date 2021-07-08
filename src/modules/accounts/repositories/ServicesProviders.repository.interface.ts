import { CreateServiceProviderRepositoryDTO } from "@modules/accounts/dtos";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

export interface ServicesProvidersRepositoryInterface {
  create(data: CreateServiceProviderRepositoryDTO): Promise<Service>;
  findByIdsActive(services_id: Partial<Service>[]): Promise<Service[]>;
}
