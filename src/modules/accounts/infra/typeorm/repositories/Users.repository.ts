import { getRepository, Repository } from "typeorm";

import { ORDER_PAGINATION_DEFAULT } from "@modules/accounts/constants/Order.const";
import {
  CreateTagsUsersClientRepositoryDTO,
  CreateUserAddressClientRepositoryDTO,
  CreateUserClientRepositoryDTO,
  CreateUserPhonesClientRepositoryDTO,
  FindUserEmailCpfRgRepositoryDTO,
  ProviderTypeForUserRepositoryDTO,
  TermsAcceptUserRepositoryDTO,
  UpdateActiveUserRepositoryDTO,
  UpdatedUserClientRepositoryDTO,
  InsideTypeForUserRepositoryDTO,
  DeleteTagsUsersClientRepositoryDTO,
  UpdateUserDetailsRepositoryDTO,
} from "@modules/accounts/dtos";
import { UserTags } from "@modules/accounts/dtos/repositories/CreateTagsUsersClient.repository.dto";
import {
  OrderPaginationPropsDTO,
  ORDER_ENUM,
  ORDER_PATTERN,
  PaginationGenericPropsDTO,
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { RatingProviderRepositoryDTO } from "@modules/accounts/dtos/repositories/RatingProviderRepository.dto";
import { UpdateActiveUsersRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateActiveUsers.repository.dto";
import { UpdateUserRepositoryDTO } from "@modules/accounts/dtos/repositories/UpdateUser.repository.dto";
import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { ClientTag } from "@modules/accounts/infra/typeorm/entities/ClientTag";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserPhone } from "@modules/accounts/infra/typeorm/entities/UserPhone";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { UserTypeUser } from "@modules/accounts/infra/typeorm/entities/UserTypeUser";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { PaginationGetUserProvidersPropsDTO } from "@modules/accounts/useCases/getUserProviders/GetUserProviders.service";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentClient } from "@modules/appointments/infra/typeorm/entities/AppointmentClient";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { paginationResult } from "@utils/paginationResult";

import { ProviderClientRating } from "../entities/ProviderRating";
import { UserAddress } from "../entities/UsersAddress";
import { UserTokens } from "../entities/UserTokens";

export interface PaginationPropsDTO {
  per_page?: string;
  fields?: Partial<User>;
  page?: string;
  order?: OrderPaginationPropsDTO;
  user_id?: string;
}

export class UsersRepository implements UsersRepositoryInterface {
  private repository: Repository<User>;
  private repository_address: Repository<Address>;
  private repository_users_types: Repository<TypeUser>;
  private repository_users_types_users: Repository<UserTypeUser>;
  private repository_phones: Repository<Phone>;
  private repository_users_phones: Repository<UserPhone>;
  private repository_users_addresses: Repository<UserAddress>;
  private repository_users_terms_accepts: Repository<UserTermsAccept>;
  private repository_tag: Repository<Tag>;
  private repository_clients_tags: Repository<ClientTag>;
  private repository_users_tokens: Repository<UserTokens>;
  private repository_clients_providers_ratings: Repository<ProviderClientRating>;
  private repository_appointments: Repository<Appointment>;
  private repository_appointments_clients: Repository<AppointmentClient>;

  constructor() {
    this.repository = getRepository(User);
    this.repository_address = getRepository(Address);
    this.repository_users_types = getRepository(TypeUser);
    this.repository_users_types_users = getRepository(UserTypeUser);
    this.repository_phones = getRepository(Phone);
    this.repository_users_phones = getRepository(UserPhone);
    this.repository_users_terms_accepts = getRepository(UserTermsAccept);
    this.repository_tag = getRepository(Tag);
    this.repository_clients_tags = getRepository(ClientTag);
    this.repository_users_tokens = getRepository(UserTokens);
    this.repository_clients_providers_ratings =
      getRepository(ProviderClientRating);
    this.repository_users_addresses = getRepository(UserAddress);
    this.repository_appointments = getRepository<Appointment>(Appointment);
    this.repository_appointments_clients = getRepository(AppointmentClient);
  }
  async findUsersProvidersWithPages({
    limit = 0,
    skip = 0,
    order = "created_at-",
    fields,
  }: // fields,
  PaginationGetUserProvidersPropsDTO<User>): Promise<
    PaginationResponsePropsDTO<User>
  > {
    const usersQuery = this.repository
      .createQueryBuilder("foundUsers")
      .leftJoinAndSelect("foundUsers.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .andWhere("user_type.name like :name", { name: "provider" })
      .leftJoinAndSelect("foundUsers.documents", "documents")
      .leftJoinAndSelect("documents.image", "image");

    if (fields?.cpf) {
      usersQuery.andWhere("foundUsers.cpf like :cpf", {
        cpf: `%${fields.cpf}%`,
      });
    }
    if (fields?.name) {
      usersQuery.andWhere("foundUsers.name like :name", {
        name: `%${fields.name}%`,
      });
    }
    if (fields?.last_name) {
      usersQuery.andWhere("foundUsers.last_name like :last_name", {
        last_name: `%${fields.last_name}%`,
      });
    }
    if (fields?.birth_date) {
      usersQuery.andWhere("foundUsers.birth_date like :birth_date", {
        birth_date: `%${fields.birth_date}%`,
      });
    }
    if (fields?.email) {
      usersQuery.andWhere("foundUsers.email like :email", {
        email: `%${fields.email}%`,
      });
    }
    if (fields?.gender) {
      usersQuery.andWhere("foundUsers.gender like :gender", {
        gender: `%${fields.gender}%`,
      });
    }

    const [order_property, ordering] = order.split(ORDER_PATTERN);

    const [results, total] = await usersQuery
      .skip(Number(skip))
      .take(Number(limit))
      .orderBy(
        `foundUsers.${order_property}`,
        `${ORDER_ENUM[ordering] as "ASC" | "DESC"}`
      )
      .getManyAndCount();

    const pagination_props = paginationResult({ skip, limit, total });

    return {
      results,
      ...pagination_props,
    };
  }

  async findUsers(ids: string[]): Promise<User[]> {
    return this.repository.findByIds(ids);
  }

  async getAllClientAppointments({
    id,
    limit = 0,
    skip = 0,
    order = ORDER_PAGINATION_DEFAULT,
    fields,
  }: PaginationGenericPropsDTO<Appointment>): Promise<[Appointment[], number]> {
    const providerQuery =
      this.repository_appointments.createQueryBuilder("foundAppointment");

    const [order_property, ordering] = order.split(ORDER_PATTERN);

    providerQuery
      .leftJoinAndSelect("foundAppointment.clients", "clients")
      .andWhere("clients.client_id = :client_id", { client_id: id })
      .leftJoinAndSelect("clients.client", "client")
      .leftJoinAndSelect("foundAppointment.providers", "providers")
      .leftJoinAndSelect("providers.provider", "provider")
      .leftJoinAndSelect("provider.image_profile", "image_profile")
      .leftJoinAndSelect("image_profile.image", "image")
      .leftJoinAndSelect("foundAppointment.transports", "transports")
      .leftJoinAndSelect("transports.transport_type", "type")
      .leftJoinAndSelect("transports.origin_address", "origin")
      .leftJoinAndSelect("transports.destination_address", "destination")
      .leftJoinAndSelect("foundAppointment.addresses", "addresses")
      .leftJoinAndSelect("addresses.address", "address")
      .leftJoinAndSelect("foundAppointment.transactions", "transactions")
      .leftJoinAndSelect("foundAppointment.locals_types", "locals_types")
      .leftJoinAndSelect("foundAppointment.services", "services")
      .leftJoinAndSelect("services.service", "service")
      .leftJoinAndSelect("transactions.itens", "itens")
      .leftJoinAndSelect("transactions.events", "events")
      .leftJoinAndSelect("events.payment_type", "payment_type")
      .skip(Number(skip))
      .take(Number(limit))
      .orderBy(
        `foundAppointment.${order_property}`,
        `${ORDER_ENUM[ordering] as "ASC" | "DESC"}`
      );

    return providerQuery.getManyAndCount();
  }

  async deleteUserPhones({
    country_code,
    ddd,
    id,
    number,
  }: CreateUserPhonesClientRepositoryDTO): Promise<void> {
    const user_phone = await this.repository_users_phones.findOne({
      where: { user_id: id },
    });
    await this.repository_users_phones.remove(user_phone);
    const phone = await this.repository_phones.findOne({
      country_code,
      ddd,
      number,
    });
    await this.repository_phones.remove(phone);
  }

  async ratingProvider({
    provider_id,
    client_id,
    value,
    details,
  }: RatingProviderRepositoryDTO): Promise<void> {
    await this.repository_clients_providers_ratings.save({
      provider_id,
      client_id,
      value,
      details,
    });
  }
  async updateUser({
    user_id,
    ...rest
  }: UpdateUserRepositoryDTO): Promise<void> {
    await this.repository.update(user_id, { ...rest });
  }
  async updateDetailsUser({
    id,
    details,
  }: UpdateUserDetailsRepositoryDTO): Promise<void> {
    await this.repository.update(id, { details });
  }

  async findUsersWithPages({
    per_page = "10",
    page = "1",
    fields,
    order = { property: "create_at", ordering: ORDER_ENUM.ASC },
  }: PaginationPropsDTO): Promise<PaginationResponsePropsDTO<User>> {
    const page_start = (Number(page) - 1) * Number(per_page);
    const usersQuery = this.repository
      .createQueryBuilder("foundUsers")
      .leftJoinAndSelect("foundUsers.types", "types")
      .leftJoinAndSelect("types.user_type", "user_type")
      .andWhere("user_type.name != :name", { name: "admin" });

    if (fields?.cpf) {
      usersQuery.andWhere("foundUsers.cpf like :cpf", {
        cpf: `%${fields.cpf}%`,
      });
    }
    if (fields?.name) {
      usersQuery.andWhere("foundUsers.name like :name", {
        name: `%${fields.name}%`,
      });
    }
    if (fields?.last_name) {
      usersQuery.andWhere("foundUsers.last_name like :last_name", {
        last_name: `%${fields.last_name}%`,
      });
    }
    if (fields?.birth_date) {
      usersQuery.andWhere("foundUsers.birth_date like :birth_date", {
        birth_date: `%${fields.birth_date}%`,
      });
    }
    if (fields?.email) {
      usersQuery.andWhere("foundUsers.email like :email", {
        email: `%${fields.email}%`,
      });
    }
    if (fields?.gender) {
      usersQuery.andWhere("foundUsers.gender like :gender", {
        gender: `%${fields.gender}%`,
      });
    }

    const [results, total] = await usersQuery
      .skip(page_start)
      .take(Number(per_page))
      .orderBy(`foundUsers.${order.property}`, `${order.ordering}`)
      .getManyAndCount();

    return {
      results,
      total,
    };
  }
  async findUserWithToken(token: string): Promise<UserTokens> {
    return this.repository_users_tokens.findOne({
      where: { refresh_token: token },
    });
  }
  async updateActiveUserTypeInsides({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void> {
    const type = await this.repository_users_types.findOne({
      where: { name: USER_TYPES_ENUM.INSIDE },
    });
    const user_type = await this.repository_users_types_users.findOne({
      where: { user_id: id, user_type_id: type.id },
    });
    await this.repository_users_types_users.update(user_type.id, {
      active,
    });
  }

  async createUserInsideType({
    name,
    last_name,
    email,
    cpf,
    rg,
    birth_date,
    password,
    gender,
    details,
    active,
  }): Promise<User> {
    const type = await this.repository_users_types.findOne({
      where: { name: USER_TYPES_ENUM.INSIDE },
    });

    const user = await this.repository.save({
      name,
      last_name,
      email,
      cpf,
      rg,
      gender,
      details,
      birth_date,
      password_hash: password,
      active,
    });

    const users_types = this.repository_users_types_users.create({
      user_id: user.id,
      user_type_id: type.id,
      active: false,
    });

    await this.repository_users_types_users.save(users_types);

    return this.repository.create(user);
  }
  async insideTypeForUser({
    active,
    user_id,
  }: InsideTypeForUserRepositoryDTO): Promise<void> {
    const provider_type = await this.repository_users_types.findOne({
      where: { name: USER_TYPES_ENUM.INSIDE },
    });

    await this.repository_users_types_users.save({
      user_id,
      user_type_id: provider_type.id,
      active,
    });
  }
  async findByIdsActive(users: Partial<User>[]): Promise<User[]> {
    return this.repository.find({ where: { id: users, active: true } });
  }
  async providerTypeForUser({
    user_id,
    active,
  }: ProviderTypeForUserRepositoryDTO): Promise<void> {
    const provider_type = await this.repository_users_types.findOne({
      where: { name: USER_TYPES_ENUM.PROVIDER },
    });

    await this.repository_users_types_users.save({
      user_id,
      user_type_id: provider_type.id,
      active,
    });
  }

  async updateActiveUser({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void> {
    await this.repository.update(id, {
      active,
    });
  }

  async updateActiveUsers(
    data: UpdateActiveUsersRepositoryDTO[]
  ): Promise<void> {
    const changeUsers = data.map((user_type_user) =>
      this.repository_users_types_users.update(
        user_type_user.user_type_user_id,
        {
          active: user_type_user.active,
        }
      )
    );

    await Promise.all(changeUsers);
  }

  async updateActivePhoneUser({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void> {
    const {
      phones: [
        {
          phone: { id: phone_id },
        },
      ],
    } = await this.repository.findOne(id, {
      relations: ["phones"],
    });

    const [phone_user] = await this.repository_users_phones.find({
      where: { phone_id },
    });

    await this.repository_users_phones.update(phone_user.id, { active });
  }

  async createUserPhones({
    country_code,
    ddd,
    number,
    id,
    active = false,
  }: CreateUserPhonesClientRepositoryDTO): Promise<void> {
    const phone_create = await this.repository_phones.save({
      country_code,
      ddd,
      number,
    });

    await this.repository_users_phones.save({
      phone_id: phone_create.id,
      user_id: id,
      active,
    });
  }

  async createUserAddress({
    user,
    zipcode,
    street,
    state,
    number,
    district,
    country,
    city,
    complement,
    latitude,
    longitude,
    reference,
  }: CreateUserAddressClientRepositoryDTO): Promise<void> {
    const address = await this.repository_address.save({
      zipcode,
      street,
      state,
      number,
      district,
      country,
      city,
      complement,
      latitude,
      longitude,
      reference,
    });

    await this.repository_users_addresses.save({
      address_id: address.id,
      user_id: user.id,
    });
  }

  async createUserClientType({
    name,
    last_name,
    email,
    cpf,
    rg,
    birth_date,
    password,
    gender,
    details,
    active,
    term,
  }: CreateUserClientRepositoryDTO): Promise<User> {
    const type = await this.repository_users_types.findOne({
      where: { name: USER_TYPES_ENUM.CLIENT },
    });

    const user = await this.repository.save({
      name,
      last_name,
      email,
      cpf,
      rg,
      gender,
      details,
      birth_date,
      password_hash: password,
      active,
    });

    const users_types = this.repository_users_types_users.create({
      user_id: user.id,
      user_type_id: type.id,
      active: true,
    });

    await this.repository_users_types_users.save(users_types);

    const term_accept = this.repository_users_terms_accepts.create({
      accept: term,
      user_id: user.id,
      type: USER_TYPES_ENUM.CLIENT,
    });

    await this.repository_users_terms_accepts.save(term_accept);

    return this.repository.create(user);
  }

  async create({
    name,
    last_name,
    email,
    cpf,
    rg,
    birth_date,
    password,
  }: CreateUserClientRepositoryDTO): Promise<User> {
    const user = this.repository.create({
      name,
      last_name,
      email,
      cpf,
      rg,
      birth_date,
      password_hash: password,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository
      .createQueryBuilder("foundUsers")
      .andWhere("foundUsers.email like :email", { email })
      .leftJoinAndSelect("foundUsers.types", "types", "types.active = true")
      .leftJoinAndSelect("types.user_type", "user_type")
      .leftJoinAndSelect("foundUsers.phones", "phones")
      .leftJoinAndSelect("phones.phone", "phone")
      .leftJoinAndSelect("foundUsers.addresses", "addresses")
      .leftJoinAndSelect("addresses.address", "address")
      .leftJoinAndSelect("foundUsers.image_profile", "image_profile")
      .leftJoinAndSelect("image_profile.image", "image")
      .leftJoinAndSelect("foundUsers.terms", "terms")
      .leftJoinAndSelect("foundUsers.transactions", "transactions")
      .leftJoinAndSelect("foundUsers.documents", "documents")
      .getOne();
  }

  async findById(id: string): Promise<User> {
    return this.repository
      .createQueryBuilder("foundUsers")
      .andWhere("foundUsers.id = :id", { id })
      .leftJoinAndSelect("foundUsers.types", "types", "types.active = true")
      .leftJoinAndSelect("types.user_type", "user_type")
      .leftJoinAndSelect("foundUsers.phones", "phones")
      .leftJoinAndSelect("phones.phone", "phone")
      .leftJoinAndSelect("foundUsers.addresses", "addresses")
      .leftJoinAndSelect("addresses.address", "address")
      .leftJoinAndSelect("foundUsers.image_profile", "image_profile")
      .leftJoinAndSelect("foundUsers.terms", "terms")
      .leftJoinAndSelect("foundUsers.transactions", "transactions")
      .leftJoinAndSelect("foundUsers.documents", "documents")
      .getOne();
  }

  async findByIdWithDocument(id: string): Promise<User> {
    return this.repository.findOne(id, { relations: ["documents"] });
  }

  async findByRg(rg: string): Promise<User> {
    return this.repository.findOne({ rg });
  }

  async findByCpf(cpf: string): Promise<User> {
    return this.repository.findOne({ cpf });
  }

  async findUserByEmailCpfRg({
    email,
    rg,
    cpf,
  }: FindUserEmailCpfRgRepositoryDTO): Promise<User> {
    return this.repository.findOne({ where: [{ email }, { cpf }, { rg }] });
  }

  async updatePasswordUser({
    id,
    password_hash,
  }: UpdatedUserClientRepositoryDTO): Promise<User> {
    await this.repository.update(id, {
      password_hash,
    });
    const user = await this.repository.findOne(id);
    return user;
  }

  async acceptTerms({
    user_id,
    accept,
  }: TermsAcceptUserRepositoryDTO): Promise<void> {
    const term = this.repository_users_terms_accepts.create({
      accept,
      user_id,
    });
    await this.repository_users_terms_accepts.save(term);
  }

  async createTagsUsersClient({
    client_tags,
  }: CreateTagsUsersClientRepositoryDTO): Promise<void> {
    await this.repository_clients_tags.save(client_tags);
  }
  async deleteTagsUsersClient({
    client_tags,
  }: DeleteTagsUsersClientRepositoryDTO): Promise<void> {
    const client_tags_exist = await this.repository_clients_tags.find({
      where: { client_id: client_tags[0].client_id },
    });

    const client_tags_remove = client_tags_exist
      .filter((client_tag) =>
        client_tags.some((tag) => tag.tag_id === client_tag.tag_id)
      )
      .map((client_tag) => client_tag.id);

    const client_tags_disabled = await this.repository_clients_tags
      .createQueryBuilder("foundTagsClient")
      .andWhere("foundTagsClient.client_id = :client_id", {
        client_id: client_tags[0].client_id,
      })
      .leftJoinAndSelect("foundTagsClient.tag", "tag")
      .andWhere("tag.active = :active", { active: false })
      .getMany();

    const client_tags_exclude = [
      ...client_tags_remove,
      ...client_tags_disabled.map((client_tag) => client_tag.id),
    ];

    if (client_tags_exclude.length > 0) {
      await this.repository_clients_tags.delete(client_tags_exclude);
    }
  }
  async verifyTagsUsersAlreadyExist({
    client_tags,
  }: CreateTagsUsersClientRepositoryDTO): Promise<UserTags[]> {
    const client_tags_exist = await this.repository_clients_tags.find({
      where: { client_id: client_tags[0].client_id },
    });
    const client_tags_active = client_tags.filter((client_tag) =>
      client_tags_exist.some(
        (client_tag_exist) => client_tag_exist.tag_id === client_tag.tag_id
      )
    );
    const client_tags_disabled = await this.repository_clients_tags
      .createQueryBuilder("foundTagsClient")
      .andWhere("foundTagsClient.client_id = :client_id", {
        client_id: client_tags[0].client_id,
      })
      .leftJoinAndSelect("foundTagsClient.tag", "tag")
      .andWhere("tag.active = :active", { active: false })
      .getMany();

    return [...client_tags_active, ...client_tags_disabled];
  }

  async verifyTagsUsersAlreadyNotExist({
    client_tags,
  }: CreateTagsUsersClientRepositoryDTO): Promise<UserTags[]> {
    const client_tags_exist = await this.repository_clients_tags.find({
      where: { client_id: client_tags[0].client_id },
    });

    return client_tags.filter((client_tag) =>
      client_tags_exist.every(
        (tag_user) => tag_user.tag_id !== client_tag.tag_id
      )
    );
  }

  async findByIdWithProfileImage(id: string): Promise<User> {
    return this.repository.findOne(id, { relations: ["image_profile"] });
  }
}
