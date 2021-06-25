import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

@Entity("transactions")
class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "number", default: 0 })
  current_amount: number;

  @Column({ type: "number", default: 0 })
  original_amount: number;

  @Column({ type: "number", default: 0 })
  discount_amount: number;

  @Column({ type: "number", default: 0 })
  increment_amount: number;

  @Column()
  status: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.transactions)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment?: Appointment;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Transaction };
