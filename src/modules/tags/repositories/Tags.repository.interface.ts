import { CreateUserDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

interface TagsRepositoryInterface {
  create(data: CreateUserDTO): Promise<Tag>;
  findByName(name: string): Promise<Tag>;
}

export { TagsRepositoryInterface };
