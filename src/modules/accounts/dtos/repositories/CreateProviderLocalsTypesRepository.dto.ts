import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";

export interface CreateProviderLocalsTypesRepositoryDTO {
  provider_id: string;
  locals_types: Array<LOCALS_TYPES_ENUM>;
}
