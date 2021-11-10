import { ConfirmAccountPaymentDTO } from "./dtos/ConfirmAccountPayment.dto";
import { CreateAccountClientPaymentDTO } from "./dtos/CreateAccountClientPayment.dto";
import { CreateAccountPaymentDTO } from "./dtos/CreateAccountPayment.dto";
import { UpdateAccountClientPaymentDTO } from "./dtos/UpdateAccountClientPayment.dto";
import { UpdateAccountPaymentDTO } from "./dtos/UpdateAccountPayment.dto";
import { UploadDocumentPaymentDTO } from "./dtos/UploadDocumentPayment.dto";

export interface PaymentProviderInterface {
  createAccountClient(data: CreateAccountClientPaymentDTO): Promise<any>;
  createAccount(data: CreateAccountPaymentDTO): Promise<any>;
  updateAccount(data: UpdateAccountPaymentDTO): Promise<void>;
  confirmAccount(data: ConfirmAccountPaymentDTO): Promise<void>;
  uploadAccountDocument(data: UploadDocumentPaymentDTO): Promise<any>;
  updateAccountClient(data: UpdateAccountClientPaymentDTO): Promise<void>;
}
