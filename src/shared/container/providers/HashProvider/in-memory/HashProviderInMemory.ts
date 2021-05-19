import { IHashProvider } from "@shared/container/providers/HashProvider/IHashProvider";

function compare(payload: string, hashed: string) {
  return payload === hashed;
}
class HashProviderInMemory implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    return payload;
  }
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export { HashProviderInMemory };
