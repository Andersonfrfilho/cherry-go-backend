import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

@Entity("transactions_events")
class TransactionEvent {
  @PrimaryColumn()
  id?: string;

  @Column()
  amount: string;

  @Column()
  transaction_id: string;

  @Column()
  status: string;

  @Column()
  details: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction?: Transaction;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { TransactionEvent };
