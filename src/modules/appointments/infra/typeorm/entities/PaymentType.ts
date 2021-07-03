import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { PAYMENT_TYPES_ENUM } from "@modules/transactions/enums/PaymentTypes.enum";

@Entity("payments_types")
export class PaymentType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "enum",
    enum: PAYMENT_TYPES_ENUM,
  })
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @ManyToMany(() => Provider, (provider) => provider.payments_types)
  providers?: Provider[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
