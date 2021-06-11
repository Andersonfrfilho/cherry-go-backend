import faker from "faker";

import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateTermParametersFactoryDTO
  extends Partial<UserTermsAccept>,
    ParametersFactoryDTO {}

class UserTermFactory {
  public generate({
    quantity = 1,
    accept,
    id,
  }: ICreateTermParametersFactoryDTO): Partial<UserTermsAccept>[] {
    return Array.from(
      { length: quantity },
      (): Partial<UserTermsAccept> => ({
        id: id ? faker.datatype.uuid() : undefined,
        accept: accept || faker.datatype.boolean(),
      })
    );
  }
}
export { UserTermFactory };
