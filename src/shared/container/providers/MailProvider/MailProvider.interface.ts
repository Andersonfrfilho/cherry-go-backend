import { SendMailDTO } from "@shared/container/providers/MailProvider/dtos";

export interface MailProviderInterface {
  sendMail({ to, variables, email_type }: SendMailDTO): Promise<void>;
}
