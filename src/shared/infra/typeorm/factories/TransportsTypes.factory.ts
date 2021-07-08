import faker from "faker";

import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

export class TransportsTypesFactory {
  public generate({
    description,
    active,
  }: Partial<TransportType>): Partial<TransportType>[] {
    return Array.from(
      { length: Object.keys(TRANSPORT_TYPES_ENUM).length },
      (_, index): Partial<TransportType> => ({
        name: Object.values(TRANSPORT_TYPES_ENUM)[index],
        description:
          description === "faker" ? faker.lorem.words() : description,
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
