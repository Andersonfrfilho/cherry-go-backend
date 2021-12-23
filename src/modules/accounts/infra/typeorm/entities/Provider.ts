import { Exclude } from "class-transformer";
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
import { Transport } from "@modules/transports/infra/typeorm/entities/Transport";

import { ProviderImage } from "./ProviderImage";
import { ProviderLocalType } from "./ProviderLocalType";
import { ProviderClientRating } from "./ProviderRating";
import { Details } from "./User";
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
  details?: Details;

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
    () => ProviderLocalType,
    (provider_local_type) => provider_local_type.provider,
    {
      eager: true,
    }
  )
  locals_types?: ProviderLocalType[];

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

  @OneToMany(() => ProviderClientRating, (rating) => rating.provider, {
    eager: true,
  })
  ratings?: ProviderClientRating;

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
  terms: UserTermsAccept[];

  @OneToMany(
    () => ProviderPaymentType,
    (payment_type) => payment_type.provider,
    { eager: true }
  )
  payments_types: ProviderPaymentType[];

  @OneToMany(
    () => UserProfileImage,
    (user_profile_image) => user_profile_image.provider,
    { eager: true }
  )
  image_profile?: UserProfileImage[];

  @OneToMany(() => ProviderImage, (provider_image) => provider_image.provider, {
    eager: true,
  })
  images?: ProviderImage[];

  @OneToMany(() => Transport, (transports) => transports.provider)
  transports?: Transport[];

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;

  @AfterLoad()
  sortAttributes() {
    if (this?.hours?.length) {
      this.hours.sort((hour_before, hour_after) => {
        const startDate = new Date();
        const [startDateHour, startDateMinute] = hour_before.start_time.split(
          ":"
        );
        startDate.setHours(Number(startDateHour), Number(startDateMinute), 0);

        const endDate = new Date();
        const [endDateHour, endDateMinute] = hour_after.start_time.split(":");
        endDate.setHours(Number(endDateHour), Number(endDateMinute), 0);
        return startDate.valueOf() - endDate.valueOf();
      });
    }
  }
}

export { Provider };
