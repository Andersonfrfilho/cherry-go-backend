import { Exclude } from "class-transformer";
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

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { ProviderAddress } from "@modules/accounts/infra/typeorm/entities/ProviderAddress";
import { ProviderAvailabilityDay } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityDay";
import { ProviderAvailabilityTime } from "@modules/accounts/infra/typeorm/entities/ProviderAvailabilityTime";
import { ProviderPaymentType } from "@modules/accounts/infra/typeorm/entities/ProviderPaymentType";
import { ProviderTransportType } from "@modules/accounts/infra/typeorm/entities/ProviderTransportTypes";
import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

import { UserProfileImage } from "./UserProfileImage";
import { UserTypeUser } from "./UserTypeUser";

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
  @Exclude()
  password_hash: string;

  @Column()
  @Exclude()
  birth_date: Date;

  @Column()
  active: boolean;

  @Column()
  gender: string;

  @Column({ type: "jsonb" })
  details?: any;

  @ManyToMany(() => Phone, { cascade: true, eager: true })
  @JoinTable({
    name: "users_phones",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "phone_id", referencedColumnName: "id" }],
  })
  phones?: Phone[];

  @ManyToMany(() => Address, { cascade: true, eager: true })
  @JoinTable({
    name: "users_addresses",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "address_id", referencedColumnName: "id" }],
  })
  addresses?: Address[];

  @OneToMany(() => UserTypeUser, (userTypesUser) => userTypesUser.user, {
    eager: true,
  })
  types?: UserTypeUser[];

  // // TODO:: refatorar relacionamento
  // @ManyToMany(() => Appointment, { cascade: true, eager: true })
  // @JoinTable({
  //   name: "appointments_providers",
  //   joinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
  //   inverseJoinColumns: [
  //     { name: "appointment_id", referencedColumnName: "id" },
  //   ],
  // })
  // appointments: Appointment[];

  @OneToMany(
    () => ProviderTransportType,
    (transport_types) => transport_types.provider,
    {
      eager: true,
    }
  )
  transports_types?: ProviderTransportType[];

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

  @OneToMany(
    () => ProviderAddress,
    (provider_address) => provider_address.provider,
    {
      eager: true,
    }
  )
  locals?: ProviderAddress[];

  @OneToMany(() => UserTermsAccept, (term) => term.user, { eager: true })
  term: UserTermsAccept[];

  @OneToMany(
    () => ProviderPaymentType,
    (payment_type) => payment_type.provider,
    { eager: true }
  )
  payments_types: ProviderPaymentType[];

  @OneToMany(
    () => UserProfileImage,
    (user_profile_image) => user_profile_image.user,
    { eager: true }
  )
  image_profile?: UserProfileImage[];

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;
}

export { Provider };
