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

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

@Entity("appointments")
class Appointment {
  @PrimaryColumn()
  id?: string;

  @Column()
  date: Date;

  @Column()
  confirm: boolean;

  @ManyToMany(() => User)
  @JoinTable({
    name: "appointments_users",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "appointment_id" }],
  })
  users?: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: "appointments_providers",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "appointment_id" }],
  })
  providers?: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: "appointments_transactions",
    joinColumns: [{ name: "appointment_id" }],
    inverseJoinColumns: [{ name: "transaction_id" }],
  })
  transactions?: Transaction[];

  @ManyToMany(() => Transport)
  @JoinTable({
    name: "appointments_transports",
    joinColumns: [{ name: "appointment_id" }],
    inverseJoinColumns: [{ name: "transport_id" }],
  })
  transports?: Transaction[];

  @ManyToMany(() => Service)
  @JoinTable({
    name: "appointments_providers_services",
    joinColumns: [{ name: "appointment_id" }],
    inverseJoinColumns: [{ name: "service_id" }],
  })
  services_providers?: Service[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Appointment };
