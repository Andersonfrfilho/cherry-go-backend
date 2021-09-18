import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { CreateUserRepositoryDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface TagsRepositoryInterface {
  create(data: CreateUserRepositoryDTO): Promise<Tag>;
  findByName(name: string): Promise<Tag>;
  findTagsWithPages(
    data: PaginationPropsDTO
  ): Promise<PaginationResponsePropsDTO>;
  findByIds(ids: string[]): Promise<Tag[]>;
}
