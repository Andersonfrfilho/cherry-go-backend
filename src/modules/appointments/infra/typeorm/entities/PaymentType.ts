import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Payment } from "@modules/appointments/infra/typeorm/entities/Payment";

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

  @OneToMany(() => Payment, (payment) => payment)
  payment?: Payment[];

  @ManyToMany((_) => Provider, (provider) => provider.payments_types)
  providers?: Provider[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { PaymentType };
