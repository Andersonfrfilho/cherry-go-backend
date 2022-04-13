import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/LocalsTypes.enum";

import { Appointment } from "./Appointment";

@Entity("appointments_locals_types")
export class AppointmentLocalType {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment?: Appointment;

  @Column({
    type: "enum",
    enum: LOCALS_TYPES_ENUM,
  })
  local_type: string;

  @Column({ type: "jsonb" })
  details?: any;

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;
}
