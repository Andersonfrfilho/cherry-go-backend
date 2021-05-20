interface ICreateUserClientDTO {
  name: string;
  last_name: string;
  cpf: string;
  rg: string;
  email: string;
  password: string;
  birth_date: Date;
  active?: boolean;
}
export { ICreateUserClientDTO };
