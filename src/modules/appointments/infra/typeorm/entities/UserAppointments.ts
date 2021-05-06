import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("user_appointment")
class Appointment {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  appointment_id: string;

  @Column()
  time_start: Date;

  @Column()
  time_end: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Appointment };
