import { getRepository, Repository } from "typeorm";

import { PaymentTypeRepositoryInterface } from "@modules/appointments/repositories/PaymentType.repository.interface";

import { PaymentType } from "../entities/PaymentType";

export class PaymentTypeRepository implements PaymentTypeRepositoryInterface {
  private repository: Repository<PaymentType>;

  constructor() {
    this.repository = getRepository(PaymentType);
  }
  async getAllPaymentTypes(): Promise<PaymentType[]> {
    return this.repository.find();
  }
}
