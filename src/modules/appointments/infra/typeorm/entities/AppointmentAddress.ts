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

import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

@Entity("appointments_addresses")
export class AppointmentAddress {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;

  @Column()
  address_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "address_id", referencedColumnName: "id" })
  address: Address;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
