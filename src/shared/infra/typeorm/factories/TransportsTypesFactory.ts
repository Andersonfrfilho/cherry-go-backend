import faker from "faker";

import { TransportTypes } from "@modules/transports/enums/TransportsTypes";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

class TransportsTypesFactory {
  public generate(): Omit<TransportType, "id">[] {
    return Array.from(
      { length: Object.keys(TransportTypes).length },
      (_, index): Omit<TransportType, "id"> => ({
        active: faker.datatype.boolean(),
        description: faker.random.words(),
        name: Object.values(TransportTypes)[index],
      })
    );
  }
}
export { TransportsTypesFactory };
