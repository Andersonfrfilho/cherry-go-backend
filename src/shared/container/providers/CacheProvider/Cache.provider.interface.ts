import { IOREDIS_EXPIRED_ENUM } from "./ioredis.cache.enums";

export interface CacheProviderInterface {
  save(
    key: string,
    value: any,
    expired_type: IOREDIS_EXPIRED_ENUM,
    time_invalide: number
  ): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
  invalidateAll(): Promise<void>;
}
