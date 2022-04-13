import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/LocalsTypes.enum";

export interface CreateProviderLocalsTypesRepositoryDTO {
  provider_id: string;
  locals_types: Array<LOCALS_TYPES_ENUM>;
}
