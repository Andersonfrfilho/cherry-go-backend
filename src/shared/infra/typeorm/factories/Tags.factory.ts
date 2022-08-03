import { faker } from "@faker-js/faker/locale/pt_BR";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateTagsFactoryDTO extends Partial<Tag>, ParametersFactoryDTO {}
export class TagsFactory {
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
        description:
          description === "faker" ? faker.lorem.words() : description,
        active: typeof active === "boolean" ? active : faker.datatype.boolean(),
      })
    );
  }
}
