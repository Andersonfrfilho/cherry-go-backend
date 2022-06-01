export interface CreateUserPhonesClientRepositoryDTO {
  id: string;
  country_code: string;
  ddd: string;
  number: string;
  active?: boolean;
}
