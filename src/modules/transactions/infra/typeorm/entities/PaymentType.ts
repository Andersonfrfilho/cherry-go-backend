import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

@Entity("payments_types")
class PaymentType {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction)
  transactions?: Transaction[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { PaymentType };
