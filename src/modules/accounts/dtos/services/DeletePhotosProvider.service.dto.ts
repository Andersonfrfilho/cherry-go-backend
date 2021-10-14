import { ProviderImage } from "@modules/accounts/infra/typeorm/entities/ProviderImage";

export interface DeletePhotosProviderServiceDTO {
  images_providers: ProviderImage[];
  provider_id: string;
}
