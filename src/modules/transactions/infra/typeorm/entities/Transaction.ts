import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

import { TransactionEvent } from "./TransactionEvent";
import { TransactionItem } from "./TransactionItem";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "bigint", default: 0 })
  current_amount: number;

  @Column({ type: "bigint", default: 0 })
  original_amount: number;

  @Column({ type: "bigint", default: 0 })
  discount_amount: number;

  @Column({ type: "bigint", default: 0 })
  increment_amount: number;

  @Column()
  status: string;

  @Column()
  client_id: string;

  @ManyToOne(() => User, (client) => client.transactions)
  @JoinColumn({ name: "client_id", referencedColumnName: "id" })
  client?: User;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.transactions)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment?: Appointment;

  @OneToMany(() => TransactionItem, (service) => service.transaction, {
    eager: true,
  })
  itens?: TransactionItem[];

  @OneToMany(
    () => TransactionEvent,
    (transaction_events) => transaction_events.transaction,
    {
      eager: true,
    }
  )
  events?: TransactionEvent[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
