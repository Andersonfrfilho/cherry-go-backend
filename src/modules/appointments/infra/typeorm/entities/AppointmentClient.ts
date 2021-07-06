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

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

@Entity("appointments_clients")
export class AppointmentClient {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  client_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "client_id", referencedColumnName: "id" })
  client: User;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;

  @Column()
  active: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
