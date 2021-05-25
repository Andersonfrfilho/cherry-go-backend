import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";

@Entity("transactions")
class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  current_amount: string;

  @Column()
  original_amount: string;

  @Column()
  discount_amount: string;

  @Column()
  increment_amount: string;

  @Column()
  status: string;

  @ManyToMany(() => Appointment)
  @JoinTable({
    name: "appointments_transactions",
    joinColumns: [{ name: "transaction_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "appointment_id", referencedColumnName: "id" },
    ],
  })
  appointments?: Appointment[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Transaction };
