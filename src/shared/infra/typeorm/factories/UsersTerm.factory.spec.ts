import faker from "faker";

import { UsersTermsFactory } from "@shared/infra/typeorm/factories";

describe("TagsFactory", () => {
  const usersTermsFactory = new UsersTermsFactory();

  it("Should be able to create factory an users terms with random information", async () => {
    // arrange act

    const terms = usersTermsFactory.generate({
      quantity: 1,
      id: "true",
    });

    // assert
    expect(terms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && terms[0].id,
          active: expect.any(Boolean) && terms[0].accept,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags with parameters information", async () => {
    // arrange act

    const accept = faker.datatype.boolean();

    const usersTerms = usersTermsFactory.generate({
      quantity: 1,
      id: "true",
      accept,
    });

    // assert
    expect(usersTerms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String) && usersTerms[0].id,
          accept: expect.any(String) && accept,
        }),
      ])
    );
  });

  it("Should be able to create factory an tags content faker without quantity and id", async () => {
    // arrange act
    const usersTerms = usersTermsFactory.generate({});

    // assert
    expect(usersTerms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: undefined,
          accept: expect.any(String) && usersTerms[0].accept,
        }),
      ])
    );
  });
});
