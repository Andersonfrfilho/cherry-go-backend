import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("transports_types")
class TransportType {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @OneToMany(() => Transport, (transports) => transports)
  transport?: Transport[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { TransportType };
