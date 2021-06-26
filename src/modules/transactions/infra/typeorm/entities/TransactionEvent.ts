import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { StatusEventsTransactionsEnum } from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

@Entity("transactions_events")
class TransactionEvent {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  amount: number;

  @Column()
  transaction_id?: string;

  @Column()
  payment_type_id?: string;

  @Column({ type: "enum", enum: StatusEventsTransactionsEnum })
  status: string;

  @Column()
  details: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction?: Transaction;

  @OneToMany(() => PaymentType, (payment_type) => payment_type)
  payments_types?: PaymentType[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { TransactionEvent };
