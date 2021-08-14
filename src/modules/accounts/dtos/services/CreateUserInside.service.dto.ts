export interface CreateUserInsideServiceDTO {
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
}
