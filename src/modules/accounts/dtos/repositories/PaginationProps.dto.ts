import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

interface Order {
  property: string;
  ordering: "ASC" | "DESC";
}
export interface PaginationPropsDTO {
  per_page?: string;
  fields?: Partial<User>;
  page?: string;
  order?: Order;
  user_id?: string;
}

export interface PaginationResponsePropsDTO {
  total: number;
  results: User[] | Tag[];
}
