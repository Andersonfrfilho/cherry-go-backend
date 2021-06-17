import { FindPhoneRepositoryDTO } from "@modules/accounts/dtos";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";

export interface PhonesRepositoryInterface {
  findPhoneUser(data: FindPhoneRepositoryDTO): Promise<Phone>;
}
