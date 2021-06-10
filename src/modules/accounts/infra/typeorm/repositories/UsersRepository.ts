import { getRepository, Repository } from "typeorm";

import {
  CreateTagsUsersRepositoryDTO,
  ICreateUserAddressClientDTO,
  ICreateUserPhonesClientRequestDTO,
  IUpdateActiveUserDTO,
  UpdateActivePhoneUserDTO,
} from "@modules/accounts/dtos";
import { ICreateUserClientDTO } from "@modules/accounts/dtos/ICreateUserClientDTO";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { IUpdatedUserClientDTO } from "@modules/accounts/dtos/IUpdatedUserClient.dto";
import { TermsAcceptUserRepositoryDTO } from "@modules/accounts/dtos/TermsAcceptUserRepository.dto";
import { UserTypes } from "@modules/accounts/enums/UserTypes.enum";
import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserPhone } from "@modules/accounts/infra/typeorm/entities/UserPhone";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private repository_address: Repository<Address>;
  private repository_users_types: Repository<TypeUser>;
  private repository_phones: Repository<Phone>;
  private repository_users_phones: Repository<UserPhone>;
  private repository_users_terms_accepts: Repository<UserTermsAccept>;
  private repository_tag: Repository<Tag>;

  constructor() {
    this.repository = getRepository(User);
    this.repository_address = getRepository(Address);
    this.repository_users_types = getRepository(TypeUser);
    this.repository_phones = getRepository(Phone);
    this.repository_users_phones = getRepository(UserPhone);
    this.repository_users_terms_accepts = getRepository(UserTermsAccept);
    this.repository_tag = getRepository(Tag);
  }

  async updateActiveUser({ id, active }: IUpdateActiveUserDTO): Promise<void> {
    await this.repository.update(id, {
      active,
    });
  }

  async updateActivePhoneUser({
    user_id,
    active,
  }: UpdateActivePhoneUserDTO): Promise<void> {
    const {
      phones: [{ id }],
    } = await this.repository.findOne(user_id, {
      relations: ["phones"],
    });

    await this.repository_users_phones.update(
      { phone_id: id, user_id },
      { active }
    );
  }

  async createUserPhones({
    country_code,
    ddd,
    number,
    user_id,
  }: ICreateUserPhonesClientRequestDTO): Promise<User> {
    const phone_exist = await this.repository_phones.findOne({
      where: { country_code, ddd, number },
    });

    const user = await this.repository.findOne(user_id);

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
  }: ICreateUserAddressClientDTO): Promise<User> {
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
    active,
  }: ICreateUserClientDTO): Promise<User> {
    const type = await this.repository_users_types.findOne({
      where: { name: UserTypes.CLIENT },
    });

    const user = this.repository.create({
      name,
      last_name,
      email,
      cpf,
      rg,
      birth_date,
      password_hash: password,
      types: [type],
      active,
    });

    await this.repository.save(user);

    return user;
  }

  async create({
    name,
    last_name,
    email,
    cpf,
    rg,
    birth_date,
    password,
  }: ICreateUserClientDTO): Promise<User> {
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
    const user = await this.repository.findOne({ email });

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
  }: IFindUserEmailCpfRgDTO): Promise<User> {
    return this.repository.findOne({ where: [{ email }, { cpf }, { rg }] });
  }

  async updatePasswordUser({
    id,
    password_hash,
  }: IUpdatedUserClientDTO): Promise<User> {
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

  async createTagsUsers({
    user_id,
    tags,
  }: CreateTagsUsersRepositoryDTO): Promise<void> {
    const tags_founds = await this.repository_tag.findByIds(tags);
    await this.repository.update(user_id, {
      tags: tags_founds,
    });
  }

  async findByIdWithProfileImage(id: string): Promise<User> {
    return this.repository.findOne(id, { relations: ["image_profile"] });
  }
}
export { UsersRepository };
