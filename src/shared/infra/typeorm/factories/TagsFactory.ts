import faker from "faker";

import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTagsFactoryDTO extends Partial<Tag>, ParametersFactoryDTO {}
class TagsFactory {
  public generate({
    quantity = 1,
    id,
    active,
    name,
    description,
  }: CreateTagsFactoryDTO): Partial<Tag>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Tag> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: name || faker.name.jobTitle(),
        description: description || faker.random.words(),
        active: active || true,
      })
    );
  }
}
export { TagsFactory };
