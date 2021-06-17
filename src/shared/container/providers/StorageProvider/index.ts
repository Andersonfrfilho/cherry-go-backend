import { container } from "tsyringe";

import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";
import { S3StorageProvider } from "@shared/container/providers/StorageProvider/implementations/S3StorageProvider";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/StorageProvider.interface";

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<StorageProviderInterface>(
  "StorageProvider",
  diskStorage[process.env.DISK_STORAGE_PROVIDER]
);
