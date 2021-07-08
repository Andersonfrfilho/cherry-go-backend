import faker from "faker";

import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class TransportsFactory {
  public generate({
    quantity = 1,
  }: ParametersFactoryDTO): Partial<Transport>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Transport> => ({
        amount: faker.datatype.number(),
        confirm: faker.datatype.boolean(),
        initial_hour: faker.date.future(),
        departure_time: faker.date.soon(),
        arrival_time_destination: faker.date.future(),
        arrival_time_return: faker.date.future(),
        return_time: faker.date.future(),
      })
    );
  }
}
export { TransportsFactory };
