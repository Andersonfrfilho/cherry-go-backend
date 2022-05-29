import { container } from "tsyringe";

import { config } from "@config/environment";
import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorage.provider";
import { S3StorageProvider } from "@shared/container/providers/StorageProvider/implementations/S3Storage.provider";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<StorageProviderInterface>(
  "StorageProvider",
  diskStorage[config.storage.provider]
);
