import {
  CreateUserClientRepositoryDTO,
  CreateUserAddressClientRepositoryDTO,
  CreateUserPhonesClientRepositoryDTO,
  UpdateActiveUserRepositoryDTO,
  CreateTagsUsersRepositoryDTO,
  TermsAcceptUserRepositoryDTO,
  ProviderTypeForUserRepositoryDTO,
  FindUserEmailCpfRgRepositoryDTO,
  UpdatePasswordUserRepositorySTO,
} from "@modules/accounts/dtos";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

export interface UsersRepositoryInterface {
  create(data: CreateUserClientRepositoryDTO): Promise<User>;
  createUserAddress(data: CreateUserAddressClientRepositoryDTO): Promise<User>;
  createUserPhones(data: CreateUserPhonesClientRepositoryDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByRg(rg: string): Promise<User>;
  findByCpf(cpf: string): Promise<User>;
  findById(id: string): Promise<User>;
  findByIdWithDocument(id: string): Promise<User>;
  findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: FindUserEmailCpfRgRepositoryDTO): Promise<User>;
  updatePasswordUser({
    id,
    password_hash,
  }: UpdatePasswordUserRepositorySTO): Promise<User>;
  createUserClientType(data: CreateUserClientRepositoryDTO): Promise<User>;
  updateActiveUser({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void>;
  updateActivePhoneUser({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void>;
  acceptTerms({ user_id, accept }: TermsAcceptUserRepositoryDTO): Promise<void>;
  createTagsUsers({
    user_id,
    tags,
  }: CreateTagsUsersRepositoryDTO): Promise<void>;
  findByIdWithProfileImage(id: string): Promise<User>;
  providerTypeForUser(data: ProviderTypeForUserRepositoryDTO): Promise<void>;
  findByIdsActive(users: Partial<User>[]): Promise<User[]>;
}
