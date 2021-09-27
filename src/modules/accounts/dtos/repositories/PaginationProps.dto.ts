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

export interface PaginationPropsGenericDTO<T> {
  per_page?: string;
  fields?: Partial<T>;
  page?: string;
  order?: Order;
  created_date?: string;
  updated_date?: string;
  [propName: string]: any;
}
export interface PaginationResponsePropsDTO<T> {
  total: number;
  results: Array<T>;
}

export interface PaginationResponseAppointmentsDTO<T> {
  total: number;
  results: {
    opens: Array<T>;
    rejected: Array<T>;
    confirmed: Array<T>;
  };
}
