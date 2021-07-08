import faker from "faker";

import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTransportsFactoryDTO
  extends Partial<Transport>,
    ParametersFactoryDTO {}
export class TransportsFactory {
  public generate({
    quantity = 1,
    id,
    amount,
    confirm,
    initial_hour,
    departure_time,
    arrival_time_destination,
    arrival_time_return,
    return_time,
  }: CreateTransportsFactoryDTO): Partial<Transport>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Transport> => ({
        id: id ? faker.datatype.uuid() : undefined,
        amount: amount || faker.datatype.number(),
        confirm:
          typeof confirm === "boolean" ? confirm : faker.datatype.boolean(),
        initial_hour: initial_hour || faker.date.future(),
        departure_time: departure_time || faker.date.soon(),
        arrival_time_destination:
          arrival_time_destination || faker.date.future(),
        arrival_time_return: arrival_time_return || faker.date.future(),
        return_time: return_time || faker.date.future(),
      })
    );
  }
}
