import {
  CreateProviderDaysAvailabilityServiceDTO,
  CreateProviderTimesAvailabilityServiceDTO,
} from "@modules/accounts/dtos";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

interface ProvidersRepositoryInterface {
  findById(id: string): Promise<Provider>;
  createDaysAvailable(
    data: CreateProviderDaysAvailabilityServiceDTO
  ): Promise<void>;
  createTimesAvailable(
    data: CreateProviderTimesAvailabilityServiceDTO
  ): Promise<void>;
}

export { ProvidersRepositoryInterface };
