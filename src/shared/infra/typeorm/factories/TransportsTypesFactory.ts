import faker from "faker";

import { TransportTypes } from "@modules/transports/enums/TransportsTypes";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import { TransportTypesFactoryDTO } from "@shared/infra/typeorm/factories/dtos";

class TransportsTypesFactory {
  public generate({
    description,
    active,
  }: Partial<TransportTypesFactoryDTO>): Omit<TransportType, "id">[] {
    return Array.from(
      { length: Object.keys(TransportTypes).length },
      (_, index): Omit<TransportType, "id"> => ({
        name: Object.values(TransportTypes)[index],
        active: active || faker.datatype.boolean(),
        description: description || faker.random.words(),
      })
    );
  }
}
export { TransportsTypesFactory };
