import { getRepository, Repository } from "typeorm";

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
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
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
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

import { UserTokens } from "../entities/UserTokens";

export class UsersRepository implements UsersRepositoryInterface {
  private repository: Repository<User>;
  private repository_address: Repository<Address>;
  private repository_users_types: Repository<TypeUser>;
  private repository_users_types_users: Repository<UserTypeUser>;
  private repository_phones: Repository<Phone>;
  private repository_users_phones: Repository<UserPhone>;
  private repository_users_terms_accepts: Repository<UserTermsAccept>;
  private repository_tag: Repository<Tag>;
  private repository_clients_tags: Repository<ClientTag>;
  private repository_users_tokens: Repository<UserTokens>;

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
    order = { property: "create_at", ordering: "ASC" },
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

  async updateActivePhoneUser({
    id,
    active,
  }: UpdateActiveUserRepositoryDTO): Promise<void> {
    const {
      phones: [{ id: phone_id }],
    } = await this.repository.findOne(id, {
      relations: ["phones"],
    });

    await this.repository_users_phones.update({ phone_id }, { active });
  }

  async createUserPhones({
    country_code,
    ddd,
    number,
    id,
  }: CreateUserPhonesClientRepositoryDTO): Promise<User> {
    const phone_exist = await this.repository_phones.findOne({
      where: { country_code, ddd, number },
    });

    const user = await this.repository.findOne(id);

    if (phone_exist) {
      user.phones = [phone_exist];

      const user_phone = await this.repository.save(user);

      return user_phone;
    }

    const phone = this.repository_phones.create({
      country_code,
      ddd,
      number,
    });

    user.phones = [phone];

    await this.repository.save(user);

    return user;
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
  }: CreateUserAddressClientRepositoryDTO): Promise<User> {
    const address_exist = await this.repository_address.findOne({
      where: { street, number, zipcode, city },
    });

    if (address_exist) {
      const user_addresses = user;
      user_addresses.addresses = [address_exist];

      const user_saved = await this.repository.save(user_addresses);

      return user_saved;
    }

    const address = this.repository_address.create({
      zipcode,
      street,
      state,
      number,
      district,
      country,
      city,
    });

    const user_address = this.repository.create({
      ...user,
      addresses: [address],
    });

    const user_saved = await this.repository.save(user_address);

    return user_saved;
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
    const [user] = await this.repository.find({
      where: {
        email,
      },
      take: 1,
    });

    return user;
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOne(id);
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
