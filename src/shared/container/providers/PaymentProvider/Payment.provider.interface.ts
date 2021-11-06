import { CreateAccountClientPaymentDTO } from "./dtos/CreateAccountClientPayment.dto";
import { UpdateAccountClientPaymentDTO } from "./dtos/UpdateAccountClientPayment.dto";

export interface PaymentProviderInterface {
  createAccountClient(data: CreateAccountClientPaymentDTO): Promise<any>;
  updateAccountClient(data: UpdateAccountClientPaymentDTO): Promise<void>;
}
