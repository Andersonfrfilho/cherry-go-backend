import { SNS } from "aws-sdk";
import { PublishInput } from "aws-sdk/clients/sns";
import { injectable } from "tsyringe";

import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { SmsProviderInterface } from "@shared/container/providers/SmsProvider/Sms.provider.interface";

@injectable()
class SnsAwsSmsProvider implements SmsProviderInterface {
  private client: SNS;

  constructor() {
    this.createClient();
  }

  private async createClient() {
    try {
      this.client = new SNS({
        apiVersion: "2010-12-01",
        accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SNS_ACCESS_KEY_ID,
        region: process.env.AWS_DEFAULT_REGION,
      });
    } catch (err) {
      console.error(`SnsAwsSmsProvider - Error:\n${err}`);
    }
  }

  async sendSms({ from, to, text, subject }: SendSmsDTO): Promise<void> {
    const sns = this.client;

    const params: PublishInput = {
      Message: text /* required */,
      PhoneNumber: to,
      Subject: subject,
    };
    await sns.publish(params).promise();
  }
}

export { SnsAwsSmsProvider };
