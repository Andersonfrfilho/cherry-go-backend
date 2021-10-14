interface ProviderImage {
  id: string;
  position: string;
}
export interface UpdatePhotosProviderServiceDTO {
  provider_id: string;
  images: ProviderImage[];
}
