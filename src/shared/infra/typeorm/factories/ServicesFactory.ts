import faker from "faker";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class ServicesFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Omit<Service, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Service, "id" | "id_user"> => ({
        name: faker.name.jobTitle(),
        amount: faker.datatype.number(),
        duration: faker.datatype.number({ min: 10000, max: 99999 }),
      })
    );
  }
}
export { ServicesFactory };
