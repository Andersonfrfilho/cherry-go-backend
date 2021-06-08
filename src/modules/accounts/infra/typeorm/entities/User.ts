import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointments";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { UserTermsAccept } from "./UserTermsAccept";

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  @Index()
  cpf: string;

  @Column({ unique: true })
  @Index()
  rg: string;

  @Column()
  @Index()
  email: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
  @Exclude()
  birth_date: Date;

  @Column("boolean", { default: false })
  active?: boolean;

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

  @ManyToMany(() => Image)
  @JoinTable({
    name: "users_images",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "image_id" }],
  })
  images?: Image[];

  @ManyToMany(() => TypeUser, (type_user) => type_user.users, {
    cascade: true,
    eager: true,
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

  @OneToMany(() => UserTermsAccept, (term) => term.user, { eager: true })
  term: UserTermsAccept[];
  // @OneToOne(() => UserTermsAccept, (term) => term.user_id, { eager: true }) // specify inverse side as a second parameter
  // term: UserTermsAccept;

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
