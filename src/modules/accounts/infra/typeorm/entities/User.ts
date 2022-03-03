import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UserProfileImage } from "@modules/accounts/infra/typeorm/entities/UserProfileImage";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";
import { Transaction } from "@modules/transactions/infra/typeorm/entities/Transaction";
import { Bank } from "@shared/container/providers/BankProvider/dtos/GetAll.dto";

import { UserTypeUser } from "./UserTypeUser";

interface DataBank {
  name: string;
  id: string;
}
interface StripeAccount {
  id: string;
  bank_accounts: Array<DataBank>;
}
interface Stripe {
  account: StripeAccount;
  customer: StripeAccount;
}

interface BankAccount {
  name: string;
}
export interface Details {
  stripe?: Stripe;
  bank_account?: BankAccount;
  fantasy_name?: string;
  color_hair?: string;
  nuance_hair?: string;
  style_hair?: string;
  height?: number;
  weight?: number;
  description?: string;
  ethnicity?: string;
  color_eye?: string;
}
@Entity("users")
class User {
  @PrimaryColumn()
  @Generated("uuid")
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
  gender: string;

  @Column({ type: "jsonb" })
  details?: Details;

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
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

  @OneToMany(
    () => UserProfileImage,
    (user_profile_image) => user_profile_image.user,
    { eager: true }
  )
  image_profile?: UserProfileImage[];

  @OneToMany(() => UserTypeUser, (userTypesUser) => userTypesUser.user, {
    eager: true,
  })
  types?: UserTypeUser[];

  @ManyToMany(() => Appointment)
  @JoinTable({
    name: "appointments_clients",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "appointment_id" }],
  })
  appointments?: Appointment[];

  @OneToMany(() => UserTermsAccept, (term) => term.user, { eager: true })
  terms: UserTermsAccept[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: "clients_tags",
    joinColumns: [{ name: "client_id" }],
    inverseJoinColumns: [{ name: "tag_id" }],
  })
  tags?: Tag[];

  @OneToMany(() => Transaction, (transaction) => transaction.client, {
    eager: true,
  })
  transactions?: Transaction[];

  @Exclude()
  @OneToMany(() => DocumentUserImage, (document) => document.user, {
    eager: true,
  })
  documents?: DocumentUserImage[];

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
