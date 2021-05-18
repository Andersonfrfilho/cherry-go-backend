import { Exclude } from "class-transformer";
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

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

@Entity("users")
class User {
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
  @Exclude()
  password_hash: string;

  @Column()
  @Exclude()
  birth_date: Date;

  @Column("boolean", { default: true })
  active?: boolean;

  @ManyToMany(() => Phone, { cascade: true })
  @JoinTable({
    name: "users_phones",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "phone_id", referencedColumnName: "id" }],
  })
  phones?: Phone[];

  @ManyToMany(() => Address, { cascade: true })
  @JoinTable({
    name: "users_addresses",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "address_id", referencedColumnName: "id" }],
  })
  addresses?: Address[];

  @ManyToMany(() => Image)
  @JoinTable({
    name: "users_images",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "image_id" }],
  })
  images?: Image[];

  @ManyToMany((type) => TypeUser, (type_user) => type_user.users, {
    cascade: true,
  })
  @JoinTable({
    name: "users_types_users",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_type_id", referencedColumnName: "id" }],
  })
  types?: TypeUser[];

  @ManyToMany(() => Appointment)
  @JoinTable({
    name: "appointments_users",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "appointment_id" }],
  })
  appointments?: Appointment[];

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

export { User };
