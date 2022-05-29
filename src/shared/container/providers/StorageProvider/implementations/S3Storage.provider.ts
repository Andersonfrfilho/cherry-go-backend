import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime";
import { resolve } from "path";

import { config } from "@config/environment";
import upload from "@config/upload";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

class S3StorageProvider implements StorageProviderInterface {
  private client: S3;
  constructor() {
    this.client = new S3({
      region: config.storage.bucket_region,
      accessKeyId: config.storage.api_key,
      secretAccessKey: config.storage.api_secret,
    });
  }
  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(upload.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalName);
    const ContentType = mime.getType(originalName);

    await this.client
      .putObject({
        Bucket: `${config.storage.bucket_name}/${folder}`,
        Key: file,
        ACL: "public-read",
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}
export { S3StorageProvider };
