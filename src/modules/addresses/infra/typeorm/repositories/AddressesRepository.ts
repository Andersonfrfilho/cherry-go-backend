import { getRepository, Repository } from "typeorm";

import {
  CreateAddressesRepositoryDTO,
  FindByIndiciesAddressesRepositoryDTO,
} from "@modules/addresses/dtos";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { AddressesRepositoryInterface } from "@modules/addresses/repositories/AddressesRepository.interface";

export class AddressesRepository implements AddressesRepositoryInterface {
  private repository: Repository<Address>;

  constructor() {
    this.repository = getRepository(Address);
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
    const address = await this.repository.findOne({
      where: { street, number, zipcode, city },
    });

    if (address) return address;

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
