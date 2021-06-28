import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface CreateTagsUsersRepositoryDTO {
  tags: Partial<Tag>[];
  user_id: string;
}
