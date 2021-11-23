import { ConfirmAccountPaymentDTO } from "./dtos/ConfirmAccountPayment.dto";
import { CreateAccountBankAccountDTO } from "./dtos/CreateAccountBankAccount.dto";
import { CreateAccountClientPaymentDTO } from "./dtos/CreateAccountClientPayment.dto";
import { CreateAccountPaymentDTO } from "./dtos/CreateAccountPayment.dto";
import { DeleteAccountBankAccountDTO } from "./dtos/DeleteAccountBankAccount.dto";
import { UpdateAccountClientPaymentDTO } from "./dtos/UpdateAccountClientPayment.dto";
import { UpdateAccountPaymentDTO } from "./dtos/UpdateAccountPayment.dto";
import { UpdatePersonAccountPaymentDTO } from "./dtos/UpdatePersonAccountPayment.dto";
import { UploadDocumentPaymentDTO } from "./dtos/UploadDocumentPayment.dto";

export interface PaymentProviderInterface {
  createAccountClient(data: CreateAccountClientPaymentDTO): Promise<any>;
  createAccount(data: CreateAccountPaymentDTO): Promise<any>;
  updatePersonAccount(data: UpdatePersonAccountPaymentDTO): Promise<any>;
  updateAccount(data: UpdateAccountPaymentDTO): Promise<void>;
  confirmAccount(data: ConfirmAccountPaymentDTO): Promise<void>;
  uploadAccountDocument(data: UploadDocumentPaymentDTO): Promise<any>;
  updateAccountClient(data: UpdateAccountClientPaymentDTO): Promise<void>;
  createAccountBankAccount(data: CreateAccountBankAccountDTO): Promise<any>;
  deleteAccountBankAccount(data: DeleteAccountBankAccountDTO): Promise<any>;
  getAccount(id: string): Promise<any>;
}
