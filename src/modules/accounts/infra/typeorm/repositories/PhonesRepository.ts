import { getRepository, Repository } from "typeorm";

import { IFindPhoneDTO } from "@modules/accounts/dtos";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { PhonesRepositoryInterface } from "@modules/accounts/repositories/PhonesRepository.interface";

class PhonesRepository implements IPhonesRepository {
  private repository: Repository<Phone>;

  constructor() {
    this.repository = getRepository(Phone);
  }
  async findPhoneUser({
    country_code,
    ddd,
    number,
  }: IFindPhoneDTO): Promise<Phone> {
    const phone = await this.repository.findOne({
      where: { country_code, ddd, number },
      relations: ["users"],
    });

    return phone;
  }
}
export { PhonesRepository };
