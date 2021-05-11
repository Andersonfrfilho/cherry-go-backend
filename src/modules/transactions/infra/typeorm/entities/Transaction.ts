import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentType } from "@modules/transactions/infra/typeorm/entities/PaymentType";

@Entity("transactions")
class Transaction {
  @PrimaryColumn()
  id?: string;

  @Column()
  amount: string;

  @Column()
  type_payment_id: string;

  @Column()
  origin_amount: string;

  @Column()
  discount_amount: string;

  @Column()
  increment_amount: string;

  @OneToMany(() => PaymentType, (payment_type) => payment_type)
  payments_types?: PaymentType[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Transaction };
