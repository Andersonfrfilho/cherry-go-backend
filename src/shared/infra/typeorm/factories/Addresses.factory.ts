import { faker } from "@faker-js/faker/locale/pt_BR";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface ICreateUserParametersFactoryDTO
  extends Partial<Address>,
    ParametersFactoryDTO {}

export class AddressesFactory {
  public generate({
    quantity = 1,
    city,
    country,
    number,
    state,
    street,
    zipcode,
    district,
    latitude,
    longitude,
    id,
  }: ICreateUserParametersFactoryDTO): Partial<Address>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Address> => ({
        id: id ? faker.datatype.uuid() : undefined,
        city: city || faker.address.city(),
        country: country || faker.address.country().toLowerCase(),
        district: district || faker.address.secondaryAddress(),
        number: number || faker.phone.phoneNumber("####"),
        state: state || faker.address.state(),
        street: street || faker.address.streetName(),
        zipcode: zipcode || faker.address.zipCode(),
        latitude: latitude || faker.address.latitude(),
        longitude: longitude || faker.address.longitude(),
      })
    );
  }
}
