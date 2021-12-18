import {
  PaginationPropsDTO,
  PaginationResponsePropsDTO,
} from "@modules/accounts/dtos/repositories/PaginationProps.dto";
import { TagService } from "@modules/accounts/infra/typeorm/entities/ServiceTag";
import { CreateUserRepositoryDTO } from "@modules/tags/dtos";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

import { CreateTagsServiceRepositoryDTO } from "../dtos/repositories/CreateTagsServices.repository.dto";

export interface TagsRepositoryInterface {
  create(data: CreateUserRepositoryDTO): Promise<Tag>;
  findByName(name: string): Promise<Tag>;
  findTagsWithPages(
    data: PaginationPropsDTO
  ): Promise<PaginationResponsePropsDTO>;
  findByIds(ids: string[]): Promise<Tag[]>;
  createTagService(data: CreateTagsServiceRepositoryDTO): Promise<void>;
  deleteTagsService(tag_service_ids: string[]): Promise<void>;
  getTagsByService(service_id: string): Promise<TagService[]>;
}
