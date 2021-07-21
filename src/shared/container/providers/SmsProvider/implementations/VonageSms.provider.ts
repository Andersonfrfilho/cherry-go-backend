import { injectable } from "tsyringe";

import { config } from "@config/environment";
import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";
import { SmsProviderInterface } from "@shared/container/providers/SmsProvider/Sms.provider.interface";
import Vonage from "@vonage/server-sdk";

@injectable()
class VonageSmsProvider implements SmsProviderInterface {
  private client: Vonage;

  constructor() {
    this.client = new Vonage({
      apiKey: config.sms.api_key,
      apiSecret: config.sms.api_secret,
    });
  }

  async sendSms({ from, to, text }: SendSmsDTO): Promise<void> {
    const vonage = this.client;
    await new Promise((resolve, reject) => {
      vonage.message.sendSms(from, to, text, {}, (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else if (response.messages[0].status === "0") {
          console.log("Message sent successfully.");
          resolve(true);
        } else {
          console.log(
            `Message failed with error: ${response.messages[0]["error-text"]}`
          );
          reject(response.messages[0]["error-text"]);
        }
      });
    });
  }
}

export { VonageSmsProvider };
