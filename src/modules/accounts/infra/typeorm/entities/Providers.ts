import { Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

import { Service } from "./Services";

@Entity("users")
class Provider {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  rg: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  birth_date: string;

  @OneToMany(() => Phone, (phone) => phone)
  phones?: Phone[];

  @OneToMany(() => Address, (address) => address)
  addresses?: Address[];

  @ManyToMany(() => TypeUser, { cascade: true })
  @JoinTable({
    name: "users_types_users",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_type_id", referencedColumnName: "id" }],
  })
  types: TypeUser[];

  @ManyToMany(() => PaymentType, (payment_type) => payment_type.providers, {
    cascade: true,
  })
  @JoinTable({
    name: "providers_payments_types",
    joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "payment_type_id", referencedColumnName: "id" },
    ],
  })
  payments_types: PaymentType[];

  @ManyToMany(() => Appointment, { cascade: true })
  @JoinTable({
    name: "appointments_providers",
    joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "appointment_id", referencedColumnName: "id" },
    ],
  })
  appointments: Appointment[];

  @ManyToMany(() => Service, { cascade: true, eager: true })
  @JoinTable({
    name: "providers_services",
    joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "service_id", referencedColumnName: "id" }],
  })
  services: Service[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Provider };
