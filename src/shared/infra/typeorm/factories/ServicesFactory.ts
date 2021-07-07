import faker from "faker";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateServiceParametersFactoryDTO
  extends Partial<Service>,
    ParametersFactoryDTO {}

class ServicesFactory {
  public generate({
    quantity = 1,
    id,
    name,
    amount,
    duration,
    active,
  }: CreateServiceParametersFactoryDTO): Partial<Service>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Service> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: name || faker.name.jobTitle(),
        amount: amount || faker.datatype.number(),
        duration: duration || faker.datatype.number({ min: 10000, max: 99999 }),
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
export { ServicesFactory };
