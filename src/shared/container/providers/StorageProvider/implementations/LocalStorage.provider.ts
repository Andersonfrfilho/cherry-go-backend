import fs from "fs";
import { resolve } from "path";

import upload from "@config/upload";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

export class LocalStorageProvider implements StorageProviderInterface {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    );
    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file);
    try {
      await fs.promises.stat(filename);
    } catch {
      return;
    }
    await fs.promises.unlink(filename);
  }
}
