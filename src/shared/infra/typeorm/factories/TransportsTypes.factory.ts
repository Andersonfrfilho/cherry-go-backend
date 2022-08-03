import { faker } from "@faker-js/faker/locale/pt_BR";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTransportTypesParametersFactoryDTO
  extends Partial<TransportType>,
    ParametersFactoryDTO {}

export class TransportsTypesFactory {
  public generate({
    description,
    id,
    active,
  }: CreateTransportTypesParametersFactoryDTO): Partial<TransportType>[] {
    return Array.from(
      { length: Object.keys(TRANSPORT_TYPES_ENUM).length },
      (_, index): Partial<TransportType> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: Object.values(TRANSPORT_TYPES_ENUM)[index],
        description:
          description === "faker" ? faker.lorem.words() : description,
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
