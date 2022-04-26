import { User } from "@modules/accounts/infra/typeorm/entities/User";

export enum ORDER_ENUM {
  ASC = "ASC",
  DESC = "DESC",
}

export interface OrderPaginationPropsDTO {
  property: string;
  ordering: ORDER_ENUM;
}
export interface PaginationGenericPropsDTO<T> {
  element_per_page?: number;
  element_start_position?: number;
  fields?: Partial<T>;
  order?: OrderPaginationPropsDTO;
  id?: string;
}

export interface PaginationPropsDTO {
  per_page?: string;
  fields?: Partial<User>;
  page?: string;
  order?: OrderPaginationPropsDTO;
  user_id?: string;
}

export interface PaginationPropsGenericDTO<T> {
  per_page?: string;
  fields?: Partial<T>;
  page?: string;
  order?: OrderPaginationPropsDTO;
  created_date?: Date;
  updated_date?: Date;
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
