import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

export interface CreateTagsUsersClientServiceDTO {
  tags: Partial<Tag>[];
  client_id: string;
}
