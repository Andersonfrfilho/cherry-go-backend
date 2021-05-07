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

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

@Entity("transports_types")
class Transport {
  @PrimaryColumn()
  id?: string;

  @Column()
  amount: string;

  @Column()
  transport_type_id: string;

  @ManyToOne(() => TransportType)
  @JoinColumn({ name: "transport_type_id" })
  transport_type: TransportType;

  @Column()
  origin_address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "origin_address_id" })
  origin_address: Address;

  @Column()
  destination_address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "destination_address_id" })
  destination_address: Address;

  @Column()
  confirm: boolean;

  @Column()
  initial_hour: Date;

  @Column()
  departure_time: Date;

  @Column()
  arrival_time_destination: Date;

  @Column()
  arrival_time_return: Date;

  @Column()
  return_time: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Transport };