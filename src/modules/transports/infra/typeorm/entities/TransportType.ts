import { Exclude } from "class-transformer";
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
import { TRANSPORT_TYPES_ENUM } from "@modules/transports/enums/TransportsTypes.enum";
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
  description?: string;

  @Column()
  active: boolean;

  @OneToMany(() => Transport, (transports) => transports)
  transport?: Transport[];

  @OneToMany(() => Provider, (provider) => provider.transports_types)
  providers?: Provider[];

  @Exclude()
  @CreateDateColumn()
  created_at?: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at?: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at?: Date;
}
