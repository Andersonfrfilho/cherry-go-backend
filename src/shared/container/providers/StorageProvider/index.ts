import { container } from "tsyringe";

import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorage.provider";
import { S3StorageProvider } from "@shared/container/providers/StorageProvider/implementations/S3Storage.provider";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
  // digital_ocean: DigitalOceanProvider,
};

container.registerSingleton<StorageProviderInterface>(
  "StorageProvider",
  diskStorage[process.env.DISK_STORAGE_PROVIDER]
);
