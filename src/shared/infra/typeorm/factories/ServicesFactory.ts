import faker from "faker";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateServiceParametersFactory
  extends Partial<Service>,
    ParametersFactoryDTO {}

class ServicesFactory {
  public generate({
    quantity = 1,
    provider_id,
    name,
    amount,
    duration,
    active,
  }: ICreateServiceParametersFactory): Omit<Service, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Service, "id"> => ({
        provider_id,
        name: name || faker.name.jobTitle(),
        amount: amount || faker.datatype.number(),
        duration: duration || faker.datatype.number({ min: 10000, max: 99999 }),
        active: active || faker.datatype.boolean(),
      })
    );
  }
}
export { ServicesFactory };
