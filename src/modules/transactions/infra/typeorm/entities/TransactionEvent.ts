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
import { STATUS_EVENTS_TRANSACTIONS_ENUM } from "@modules/transactions/enums";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

@Entity("transactions_events")
export class TransactionEvent {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  amount: number;

  @Column()
  transaction_id?: string;

  @Column()
  payment_type_id?: string;

  @Column({ type: "enum", enum: STATUS_EVENTS_TRANSACTIONS_ENUM })
  status: string;

  @Column()
  details: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id", referencedColumnName: "id" })
  transaction?: Transaction;

  @ManyToOne(() => PaymentType)
  @JoinColumn({ name: "payment_type_id", referencedColumnName: "id" })
  payment_type?: PaymentType;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
