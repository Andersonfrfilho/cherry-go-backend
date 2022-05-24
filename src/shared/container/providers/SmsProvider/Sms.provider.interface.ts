import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";

interface SmsProviderInterface {
  sendSms(data: SendSmsDTO): Promise<void>;
}

export { SmsProviderInterface };
