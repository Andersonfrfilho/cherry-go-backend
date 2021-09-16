export interface CreateUserProviderRepositoryDTO {
  name: string;
  last_name: string;
  cpf: string;
  rg: string;
  email: string;
  password: string;
  birth_date: Date;
  gender: string;
  details?: any;
  active?: boolean;
  term: boolean;
  term_provider: boolean;
}
