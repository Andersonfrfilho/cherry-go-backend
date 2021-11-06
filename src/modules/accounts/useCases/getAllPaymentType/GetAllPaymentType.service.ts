import { inject, injectable } from "tsyringe";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";

@injectable()
export class GetAllPaymentTypeServiceService {
  constructor(
    @inject("PaymentTypeRepository")
    private paymentTypeRepository: PaymentTypeRepositoryInterface
  ) {}
  async execute(): Promise<PaymentType[]> {
    return this.paymentTypeRepository.getAllPaymentTypes();
  }
}
