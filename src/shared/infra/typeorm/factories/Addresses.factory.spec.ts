import { faker } from "@faker-js/faker/locale/pt_BR";
import { AddressesFactory } from "@shared/infra/typeorm/factories";

describe("AddressesFactory", () => {
  const addressesFactory = new AddressesFactory();

  it("Should be able to create factory an addresses with random information", async () => {
    // arrange act
    const addresses = addressesFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && addresses[0].id,
          city: expect.any(String) && addresses[0].city,
          country: expect.any(String) && addresses[0].country,
          district: expect.any(String) && addresses[0].district,
          number: expect.any(String) && addresses[0].number,
          state: expect.any(String) && addresses[0].state,
          street: expect.any(String) && addresses[0].street,
          zipcode: expect.any(String) && addresses[0].zipcode,
          latitude: expect.any(String) && addresses[0].latitude,
          longitude: expect.any(String) && addresses[0].longitude,
        }),
      ])
    );
  });

  it("Should be able to create factory an addresses with parameters information", async () => {
    // arrange act
    const city = faker.address.city();
    const country = faker.address.country().toLowerCase();
    const district = faker.address.secondaryAddress();
    const number = faker.phone.phoneNumber("####");
    const state = faker.address.state();
    const street = faker.address.streetName();
    const zipcode = faker.phone.phoneNumber("########");
    const latitude = faker.phone.phoneNumber("##.######");
    const longitude = faker.phone.phoneNumber("##.######");
    const addresses = addressesFactory.generate({
      quantity: 1,
      id: "true",
      city,
      country,
      district,
      number,
      state,
      street,
      zipcode,
      latitude,
      longitude,
    });

    // assert
    expect(addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && addresses[0].id,
          city: expect.any(String) && city,
          country: expect.any(String) && country,
          district: expect.any(String) && district,
          number: expect.any(String) && number,
          state: expect.any(String) && state,
          street: expect.any(String) && street,
          zipcode: expect.any(String) && zipcode,
          latitude: expect.any(String) && latitude,
          longitude: expect.any(String) && longitude,
        }),
      ])
    );
  });

  it("Should be able to create factory an addresses without quantity and id", async () => {
    // arrange act
    const addresses = addressesFactory.generate({});

    // assert
    expect(addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          city: expect.any(String) && addresses[0].city,
          country: expect.any(String) && addresses[0].country,
          district: expect.any(String) && addresses[0].district,
          number: expect.any(String) && addresses[0].number,
          state: expect.any(String) && addresses[0].state,
          street: expect.any(String) && addresses[0].street,
          zipcode: expect.any(String) && addresses[0].zipcode,
          latitude: expect.any(String) && addresses[0].latitude,
          longitude: expect.any(String) && addresses[0].longitude,
        }),
      ])
    );
  });
});
