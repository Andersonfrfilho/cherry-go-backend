import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

@Entity("transports")
export class Transport {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider, { eager: true })
  @JoinColumn({ name: "provider_id" })
  provider?: Provider;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment, { eager: true })
  @JoinColumn({ name: "appointment_id" })
  appointment?: Appointment;

  @Column()
  amount: number;

  @Column()
  transport_type_id?: string;

  @ManyToOne(() => TransportType, { eager: true })
  @JoinColumn({ name: "transport_type_id" })
  transport_type?: TransportType;

  @Column()
  origin_address_id?: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: "origin_address_id" })
  origin_address?: Address;

  @Column()
  destination_address_id?: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: "destination_address_id" })
  destination_address?: Address;

  @Column()
  confirm: boolean;

  @Column()
  initial_hour: Date;

  @Column()
  departure_time: Date;

  @Column()
  arrival_time_destination?: Date;

  @Column()
  arrival_time_return?: Date;

  @Column()
  return_time: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
