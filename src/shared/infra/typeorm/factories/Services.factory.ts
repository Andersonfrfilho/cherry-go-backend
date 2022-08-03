import { faker } from "@faker-js/faker/locale/pt_BR"

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateServiceParametersFactoryDTO
  extends Partial<Service>,
    ParametersFactoryDTO {}

export class ServicesFactory {
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
        duration: duration || Number(faker.phone.phoneNumber("#######")),
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
