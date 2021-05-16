import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Providers";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

import { Appointment } from "./Appointments";

@Entity("appointments_providers_services")
class AppointmentProviderService {
  @PrimaryColumn()
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id" })
  provider: Provider;

  @Column()
  appointment_id: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: "appointment_id" })
  appointment: Appointment;

  @Column()
  service_id: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "service_id" })
  service: Service;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { AppointmentProviderService };
