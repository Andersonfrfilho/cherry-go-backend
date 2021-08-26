import { User } from "@modules/accounts/infra/typeorm/entities/User";

interface Order {
  property: string;
  ordering: "ASC" | "DESC";
}
export interface PaginationPropsDTO {
  per_page?: string;
  fields?: Partial<User>;
  page?: string;
  order?: Order;
}

export interface PaginationResponsePropsDTO {
  total: number;
  data: User[];
}
