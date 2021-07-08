import faker from "faker";

import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

interface CreateImageParametersFactoryDTO
  extends Partial<Image>,
    ParametersFactoryDTO {}

class ImagesFactory {
  public generate({
    quantity = 1,
    id,
    name,
  }: CreateImageParametersFactoryDTO): Partial<Image>[] {
    return Array.from(
      { length: quantity },
      (): Partial<Image> => ({
        id: id ? faker.datatype.uuid() : undefined,
        name: name || faker.internet.avatar(),
      })
    );
  }
}
export { ImagesFactory };
