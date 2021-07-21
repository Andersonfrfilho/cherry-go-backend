import { ClientTag } from "@modules/accounts/infra/typeorm/entities/ClientTag";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { UsersFactory, TagsFactory } from "@shared/infra/typeorm/factories";

import { User } from "./User";

describe("ActiveAccountService", () => {
  const usersFactory = new UsersFactory();
  const tagsFactory = new TagsFactory();

  it("Should be able to new instance an Client Tag", async () => {
    // arrange
    // const [user] = usersFactory.generate({
    //   quantity: 1,
    //   active: false,
    //   id: "true",
    // }) as User[];

    // const [tag] = usersFactory.generate({
    //   quantity: 1,
    //   active: false,
    //   id: "true",
    // }) as Tag[];

    // act
    const clientTag = new ClientTag();

    // assert
    expect(clientTag).toBeInstanceOf(ClientTag);
  });
});
