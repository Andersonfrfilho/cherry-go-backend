import { IFindPhoneDTO } from "@modules/accounts/dtos";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";

interface IPhonesRepository {
  findPhoneUser(data: IFindPhoneDTO): Promise<Phone>;
}

export { IPhonesRepository };
