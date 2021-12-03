import { getRepository, Repository } from "typeorm";

import {
  CreateAddressesRepositoryDTO,
  FindByIndiciesAddressesRepositoryDTO,
} from "@modules/addresses/dtos";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/Addresses.repository.interface";

export class AddressesRepository implements AddressesRepositoryInterface {
  private repository: Repository<Address>;

  constructor() {
    this.repository = getRepository(Address);
  }
  async delete(address_ids: string[]): Promise<void> {
    await this.repository.delete(address_ids);
  }

  async findIndices({
    city,
    number,
    street,
    zipcode,
  }: FindByIndiciesAddressesRepositoryDTO): Promise<Address> {
    return this.repository.findOne({
      where: { street, number, zipcode, city },
    });
  }

  async create({
    city,
    country,
    district,
    latitude,
    longitude,
    number,
    state,
    street,
    zipcode,
  }: CreateAddressesRepositoryDTO): Promise<Address> {
    return this.repository.save({
      city,
      country,
      district,
      latitude,
      longitude,
      number,
      state,
      street,
      zipcode,
    });
  }
}
