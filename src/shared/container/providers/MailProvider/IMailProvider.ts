import { ISendMailDTO } from "@shared/container/providers/MailProvider/dtos/ISendMailDTO";

interface IMailProvider {
  sendMail({ to, variables, email_type }: ISendMailDTO): Promise<void>;
}

export { IMailProvider };
