import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

export interface FindByAreaRepositoryDTO extends Partial<Address> {
  distance?: string;
  user_id: string;
}
