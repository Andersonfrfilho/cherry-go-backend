import {
  CreateUserClientRepositoryDTO,
  CreateUserAddressClientRepositoryDTO,
  CreateUserPhonesClientRepositoryDTO,
  UpdateActiveUserRepositoryDTO,
  CreateTagsUsersClientRepositoryDTO,
  TermsAcceptUserRepositoryDTO,
  ProviderTypeForUserRepositoryDTO,
  FindUserEmailCpfRgRepositoryDTO,
  UpdatePasswordUserRepositorySTO,
  InsideTypeForUserRepositoryDTO,
  CreateUserInsideRepositoryDTO,
  DeleteTagsUsersClientRepositoryDTO,
  UpdateUserDetailsRepositoryDTO,
} from "@modules/accounts/dtos";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { UserTags } from "../dtos/repositories/CreateTagsUsersClient.repository.dto";
import {
  PaginationGenericPropsDTO,
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "../dtos/repositories/PaginationProps.dto";
import { RatingProviderRepositoryDTO } from "../dtos/repositories/RatingProviderRepository.dto";
import { UpdateUserRepositoryDTO } from "../dtos/repositories/UpdateUser.repository.dto";
import { Appointment } from "../dtos/services/SetStageAppointmentClient.dto";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export interface UsersRepositoryInterface {
  create(data: CreateUserClientRepositoryDTO): Promise<User>;
  createUserAddress(data: CreateUserAddressClientRepositoryDTO): Promise<void>;
  createUserPhones(data: CreateUserPhonesClientRepositoryDTO): Promise<void>;
  deleteUserPhones(data: CreateUserPhonesClientRepositoryDTO): Promise<void>;
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
  createTagsUsersClient(
    data: CreateTagsUsersClientRepositoryDTO
  ): Promise<void>;
  findByIdWithProfileImage(id: string): Promise<User>;
  providerTypeForUser(data: ProviderTypeForUserRepositoryDTO): Promise<void>;
  insideTypeForUser(data: InsideTypeForUserRepositoryDTO): Promise<void>;
  findByIdsActive(users: Partial<User>[]): Promise<User[]>;
  createUserInsideType(data: CreateUserInsideRepositoryDTO): Promise<User>;
  updateActiveUserTypeInsides(
    data: UpdateActiveUserRepositoryDTO
  ): Promise<void>;
  findUserWithToken(token: string): Promise<UserTokens>;
  findUsersWithPages(
    data: PaginationPropsDTO
  ): Promise<PaginationResponsePropsDTO<User>>;
  verifyTagsUsersAlreadyExist({
    client_tags,
  }: CreateTagsUsersClientRepositoryDTO): Promise<UserTags[]>;
  verifyTagsUsersAlreadyNotExist({
    client_tags,
  }: CreateTagsUsersClientRepositoryDTO): Promise<UserTags[]>;
  deleteTagsUsersClient({
    client_tags,
  }: DeleteTagsUsersClientRepositoryDTO): Promise<void>;
  updateDetailsUser({
    id,
    details,
  }: UpdateUserDetailsRepositoryDTO): Promise<void>;
  updateUser({
    email,
    name,
    last_name,
    user_id,
  }: UpdateUserRepositoryDTO): Promise<void>;
  ratingProvider({
    provider_id,
    client_id,
    value,
  }: RatingProviderRepositoryDTO): Promise<void>;
  getAllClientAppointments(
    data: PaginationGenericPropsDTO<Appointment>
  ): Promise<[Appointment[], number]>;
}
