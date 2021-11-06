import { PaymentType } from "../infra/typeorm/entities/PaymentType";

export interface PaymentTypeRepositoryInterface {
  getAllPaymentTypes(): Promise<PaymentType[]>;
}
