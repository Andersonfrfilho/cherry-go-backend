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

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ItensTypesTransactions } from "@modules/transactions/enums/ItensTypesTransactions.enum";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("transactions_itens")
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  transaction_id: string;

  @Column({ type: "jsonb" })
  elements?: Partial<Service | Transport>;

  @Column()
  reference_key?: string;

  @Column({ type: "enum", enum: ItensTypesTransactions })
  type: string;

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
