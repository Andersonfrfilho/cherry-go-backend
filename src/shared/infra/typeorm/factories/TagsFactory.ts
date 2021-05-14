import faker from "faker";

import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class TagsFactory {
  public generate({ quantity = 1 }: ParametersFactoryDTO): Omit<Tag, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Tag, "id"> => ({
        name: faker.name.jobTitle(),
        description: faker.random.words(),
      })
    );
  }
}
export { TagsFactory };
