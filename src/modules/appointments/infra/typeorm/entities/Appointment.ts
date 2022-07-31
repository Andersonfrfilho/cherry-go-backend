import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

import { AppointmentAddress } from "./AppointmentAddress";
import { AppointmentClient } from "./AppointmentClient";
import { AppointmentLocalType } from "./AppointmentLocalType";
import { AppointmentProvider } from "./AppointmentProvider";
import { AppointmentProviderService } from "./AppointmentsProviderService";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  initial_date?: Date;

  @Column()
  final_date?: Date;

  @Column()
  duration?: number;

  @Column()
  confirm: boolean;

  @OneToMany(
    () => AppointmentClient,
    (appointment_client) => appointment_client.appointment,
    { eager: true }
  )
  clients?: AppointmentClient[];

  @OneToMany(
    () => AppointmentProvider,
    (appointment_provider) => appointment_provider.appointment,
    { eager: true }
  )
  providers?: AppointmentProvider[];

  @OneToMany(() => Transport, (transports) => transports.appointment)
  transports?: Transport[];

  @OneToMany(
    () => AppointmentProviderService,
    (appointment_provider_service) => appointment_provider_service.appointment,
    { eager: true }
  )
  services?: AppointmentProviderService[];

  @OneToMany(
    () => AppointmentAddress,
    (appointment_address) => appointment_address.appointment,
    { eager: true }
  )
  addresses?: AppointmentAddress[];

  @OneToMany(() => Transaction, (transaction) => transaction.appointment, {
    eager: true,
  })
  transactions?: Transaction[];

  @OneToMany(
    () => AppointmentLocalType,
    (payment_type) => payment_type.appointment,
    { eager: true }
  )
  locals_types?: AppointmentLocalType[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
