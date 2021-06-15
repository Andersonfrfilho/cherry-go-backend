interface Hour {
  start_date: string;
  end_date: string;
}
export interface CreateProviderTimesAvailabilityServiceDTO {
  provider_id: string;
  times: Hour[];
}
