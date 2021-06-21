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

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  date: Date;

  @Column()
  confirm: boolean;

  @ManyToMany(() => User)
  @JoinTable({
    name: "appointments_users",
    joinColumns: [{ name: "appointment_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
  })
  users?: User[];

  @ManyToMany(() => Provider)
  @JoinTable({
    name: "appointments_providers",
    joinColumns: [{ name: "appointment_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
  })
  providers?: Provider[];

  @ManyToMany(() => Transaction)
  @JoinTable({
    name: "appointments_transactions",
    joinColumns: [{ name: "appointment_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "transaction_id", referencedColumnName: "id" },
    ],
  })
  transactions?: Transaction[];

  @ManyToMany(() => Transport)
  @JoinTable({
    name: "appointments_transports",
    joinColumns: [{ name: "appointment_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "transport_id", referencedColumnName: "id" }],
  })
  transports?: Transport[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
