import { faker } from "@faker-js/faker/locale/pt_BR";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateTermParametersFactoryDTO
  extends Partial<UserTermsAccept>,
    ParametersFactoryDTO {}

export class UsersTermsFactory {
  public generate({
    quantity = 1,
    accept,
    id,
  }: ICreateTermParametersFactoryDTO): Partial<UserTermsAccept>[] {
    return Array.from(
      { length: quantity },
      (): Partial<UserTermsAccept> => ({
        id: id ? faker.datatype.uuid() : undefined,
        accept: typeof accept === "boolean" ? accept : faker.datatype.boolean(),
      })
    );
  }
}
