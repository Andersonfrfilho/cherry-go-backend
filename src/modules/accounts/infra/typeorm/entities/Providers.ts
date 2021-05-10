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

  @Column()
  avatar?: string;

  @OneToMany(() => Phone, (phone) => phone)
  phones?: Phone[];

  @OneToMany(() => Address, (address) => address)
  address?: Address[];

  @ManyToMany(() => TypeUser)
  @JoinTable({
    name: "users_types_users",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "type_id" }],
  })
  types: TypeUser[];

  @ManyToMany(() => PaymentType)
  @JoinTable({
    name: "providers_payments_types",
    joinColumns: [{ name: "provider_id" }],
    inverseJoinColumns: [{ name: "payment_type_id" }],
  })
  payments_type: PaymentType[];

  @ManyToMany(() => Appointment)
  @JoinTable({
    name: "providers_appointments",
    joinColumns: [{ name: "provider_id" }],
    inverseJoinColumns: [{ name: "appointment_id" }],
  })
  appointments: Appointment[];

  @ManyToMany(() => Service)
  @JoinTable({
    name: "providers_services",
    joinColumns: [{ name: "provider_id" }],
    inverseJoinColumns: [{ name: "service_id" }],
  })
  services: Service[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Expose({ name: "avatar_url" })
  avatar_url?(): string {
    switch (process.env.DISK_STORAGE_PROVIDER) {
      case "local":
        return `${process.env.APP_API_URL}/avatar/${this.avatar}`;
      case "s3":
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }
}

export { Provider };
