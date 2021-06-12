import faker from "faker";

import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTagsFactoryDTO extends Partial<Tag>, ParametersFactoryDTO {}
class TagsFactory {
  public generate({
    quantity = 1,
    id,
    active,
  }: CreateTagsFactoryDTO): Partial<Tag>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Tag> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: faker.name.jobTitle(),
        description: faker.random.words(),
        active: active || true,
      })
    );
  }
}
export { TagsFactory };
