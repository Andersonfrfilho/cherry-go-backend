import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { ProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

import { ProviderAvailabilityDay } from "./ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "./ProviderAvailabilityTime";
import { ProviderPaymentType } from "./ProviderPaymentType";
import { Service } from "./Services";
import { UserTermsAccept } from "./UserTermsAccept";

@Entity("users")
class Provider {
  @PrimaryGeneratedColumn("uuid")
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

  @Column()
  active: boolean;

  @OneToMany(() => Phone, (phone) => phone)
  phones?: Phone[];

  @OneToMany(() => Address, (address) => address)
  addresses?: Address[];

  @ManyToMany(() => TypeUser, { cascade: true, eager: true })
  @JoinTable({
    name: "users_types_users",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_type_id", referencedColumnName: "id" }],
  })
  types: TypeUser[];

  @ManyToMany(() => PaymentType, (payment_type) => payment_type.providers, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: "providers_payments_types",
    joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "payment_type_id", referencedColumnName: "id" },
    ],
  })
  payments_types: PaymentType[];

  @ManyToMany(() => Appointment, { cascade: true, eager: true })
  @JoinTable({
    name: "appointments_providers",
    joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
    inverseJoinColumns: [
      { name: "appointment_id", referencedColumnName: "id" },
    ],
  })
  appointments: Appointment[];

  @OneToMany(
    () => ProviderTransportType,
    (transport_types) => transport_types.provider,
    {
      eager: true,
    }
  )
  transport_types?: ProviderTransportType[];

  @OneToMany(() => Service, (service) => service.provider, {
    eager: true,
  })
  services?: Service[];

  @OneToMany(() => ProviderAvailabilityDay, (day) => day.provider, {
    eager: true,
  })
  days?: ProviderAvailabilityDay[];

  @OneToMany(() => ProviderAvailabilityTime, (time) => time.provider, {
    eager: true,
  })
  hours?: ProviderAvailabilityTime[];

  @OneToMany(() => UserTermsAccept, (term) => term.user, { eager: true })
  term: UserTermsAccept[];

  @OneToMany(
    () => ProviderPaymentType,
    (payment_type) => payment_type.provider,
    { eager: true }
  )
  payment_type: ProviderPaymentType[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Provider };
