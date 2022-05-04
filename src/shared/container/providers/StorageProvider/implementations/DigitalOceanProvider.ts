import { S3, Endpoint, Credentials } from "aws-sdk";

import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/interfaces/StorageProviderInterface";

export interface UploadedMulterFileI {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

class S3StorageProvider implements StorageProviderInterface {
  private client: S3;
  constructor() {
    const spacesEndpoint = new Endpoint("sfo3.digitaloceanspaces.com");
    this.client = new S3({
      endpoint: spacesEndpoint,
      credentials: new Credentials({
        accessKeyId: "PLPORX7NHZZR22JHLD6G",
        secretAccessKey: "oEybtoHeQ+Ituj6pKMyPxYuPmaji/jpfb+pvECsznSY",
      }),
    });
  }
  async save(file: string, folder: string, buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.putObject(
        {
          Bucket: "cherry-go-stg",
          Key: file,
          Body: buffer,
          ACL: "public-read",
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `https://cherry-go-stg.sfo3.digitaloceanspaces.com/${folder}`
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || "Something went wrong"
                }`
              )
            );
          }
        }
      );
    });
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
