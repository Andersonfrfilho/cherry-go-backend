import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

export interface FindByAreaRepositoryDTO extends Partial<Address> {
  distance?: number;
  user_id: string;
  skip?: number;
  limit?: number;
}

export interface ResponseFindByAreaRepository {
  total: number;
  providers: Provider[];
}
