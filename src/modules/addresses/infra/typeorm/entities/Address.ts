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

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppointmentAddress } from "@modules/appointments/infra/typeorm/entities/AppointmentAddress";
import { initialUpperCase } from "@utils/initialUppercaseTypeorm";
import { lowercase } from "@utils/lowercaseTypeorm";

@Entity("addresses")
class Address {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ transformer: [lowercase] })
  street: string;

  @Column()
  number: string;

  @Column()
  zipcode: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column({ transformer: [lowercase] })
  district: string;

  @Column({ transformer: [lowercase] })
  city: string;

  @Column({ transformer: [lowercase] })
  state: string;

  @Column({ transformer: [initialUpperCase] })
  country: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: "users_addresses",
    joinColumns: [{ name: "address_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
  })
  users?: User[];

  @OneToMany(
    () => AppointmentAddress,
    (appointment_address) => appointment_address.address
  )
  appointments: AppointmentAddress[];

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

export { Address };
