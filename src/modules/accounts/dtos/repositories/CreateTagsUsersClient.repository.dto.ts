import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface CreateTagsUsersClientRepositoryDTO {
  tags: Partial<Tag>[];
  client_id: string;
}
