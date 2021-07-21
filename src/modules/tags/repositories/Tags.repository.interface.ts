import { CreateUserRepositoryDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface TagsRepositoryInterface {
  create(data: CreateUserRepositoryDTO): Promise<Tag>;
  findByName(name: string): Promise<Tag>;
}
