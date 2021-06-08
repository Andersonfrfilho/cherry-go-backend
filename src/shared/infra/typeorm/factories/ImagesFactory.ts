import faker from "faker";

import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ParametersFactoryDTO } from "@shared/infra/typeorm/dtos/Factory.dto";

class ImagesFactory {
  public generate({ quantity = 1 }: ParametersFactoryDTO): Omit<Image, "id">[] {
    return Array.from(
      { length: quantity },
      (): Omit<Image, "id"> => ({
        name: faker.internet.avatar(),
      })
    );
  }
}
export { ImagesFactory };
