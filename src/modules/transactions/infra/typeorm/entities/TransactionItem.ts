import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";

@Entity("transactions_itens")
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  transaction_id: string;

  @Column({ type: "jsonb" })
  elements?: any; // TODO: ajustar o tipo

  @Column()
  reference_key?: string;

  @Column()
  type: string; // TODO::ajustar tipo

  @Column()
  increment_amount: number;

  @Column()
  discount_amount: number;

  @Column()
  value: number;

  @ManyToOne(() => Transaction, (transactions) => transactions.itens)
  @JoinColumn({ name: "transaction_id", referencedColumnName: "id" })
  transaction?: Transaction;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
