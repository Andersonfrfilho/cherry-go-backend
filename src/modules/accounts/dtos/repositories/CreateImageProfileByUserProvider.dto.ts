import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

export interface CreateImageProfileByUserProviderDTO {
  user: User;
  image: Image;
}
