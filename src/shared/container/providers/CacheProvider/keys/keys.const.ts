export const CLIENT_PHONE_CACHE_KEY = (id: string): string =>
  `clients:${id}:phone`;

export const CLIENT_CREATE_APPOINTMENT_CACHE_KEY = (id: string): string =>
  `clients:${id}:appointment`;
