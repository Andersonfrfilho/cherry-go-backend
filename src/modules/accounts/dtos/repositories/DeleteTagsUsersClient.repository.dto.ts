export interface UserTags {
  client_id: string;
  tag_id: string;
}
export interface DeleteTagsUsersClientRepositoryDTO {
  client_tags: UserTags[];
}
