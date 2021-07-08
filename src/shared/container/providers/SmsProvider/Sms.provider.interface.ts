import { SendSmsDTO } from "@shared/container/providers/SmsProvider/dtos/SendSms.dto";

interface SmsProviderInterface {
  sendSms({ to, from, text }: SendSmsDTO): Promise<void>;
}

export { SmsProviderInterface };
