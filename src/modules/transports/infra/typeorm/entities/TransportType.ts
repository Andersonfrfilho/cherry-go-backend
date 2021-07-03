import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("transports_types")
export class TransportType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "enum",
    enum: TRANSPORT_TYPES_ENUM,
  })
  name: string;

  @Column()
  description: string;

  @Column()
  active: boolean;

  @OneToMany(() => Transport, (transports) => transports)
  transport?: Transport[];

  @OneToMany(() => Provider, (provider) => provider.transport_types)
  providers?: Provider[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
