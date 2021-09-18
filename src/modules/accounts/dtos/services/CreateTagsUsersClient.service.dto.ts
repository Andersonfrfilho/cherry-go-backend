interface UserTags {
  client_id: string;
  tag_id: string;
}
export interface CreateTagsUsersClientServiceDTO {
  client_tags?: UserTags[];
  client_tags_exclude?: UserTags[];
}
