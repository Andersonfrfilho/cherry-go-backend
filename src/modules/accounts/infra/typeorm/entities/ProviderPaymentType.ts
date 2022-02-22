import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

@Entity("providers_payments_types")
class ProviderPaymentType {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

  @Column()
  payment_type_id: string;

  @ManyToOne(() => PaymentType, { eager: true })
  @JoinColumn({ name: "payment_type_id", referencedColumnName: "id" })
  payment_type: PaymentType;

  @Column()
  active: boolean;

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;
}

export { ProviderPaymentType };
