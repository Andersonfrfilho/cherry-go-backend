import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

export interface FindByAreaRepositoryDTO extends Partial<Address> {
  distance?: number;
  user_id: string;
}
