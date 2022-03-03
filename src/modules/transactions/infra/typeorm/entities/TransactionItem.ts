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

import {
  LocalCacheData,
  TransporTypeProviderCacheData,
} from "@modules/accounts/dtos/services/CreateAppointmentPaymentCard.service.dto";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { ITENS_TYPES_TRANSACTIONS_ENUM } from "@modules/transactions/enums/ItensTypesTransactions.enum";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("transactions_itens")
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  transaction_id: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.itens)
  @JoinColumn({ name: "transaction_id", referencedColumnName: "id" })
  transaction?: Transaction;

  @Column({ type: "jsonb" })
  elements?: Partial<
    Service | Transport | TransporTypeProviderCacheData | LocalCacheData
  >;

  @Column()
  reference_key?: string;

  @Column({ type: "enum", enum: ITENS_TYPES_TRANSACTIONS_ENUM })
  type: string;

  @Column()
  increment_amount: number;

  @Column()
  discount_amount: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
