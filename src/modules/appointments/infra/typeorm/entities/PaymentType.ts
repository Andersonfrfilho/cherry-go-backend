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
import { PaymentTypesEnum } from "@modules/transactions/enums/PaymentTypes.enum";

@Entity("payments_types")
class PaymentType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "enum",
    enum: PaymentTypesEnum,
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

export { PaymentType };
