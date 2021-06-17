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

import { Address } from "@modules/accounts/infra/typeorm/entities/Address";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { UserProfileImage } from "@modules/accounts/infra/typeorm/entities/UserProfileImage";
import { UserTermsAccept } from "@modules/accounts/infra/typeorm/entities/UserTermsAccept";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

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

  @OneToMany(
    () => UserProfileImage,
    (user_profile_image) => user_profile_image.user,
    { eager: true }
  )
  image_profile?: UserProfileImage[];

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

  @ManyToMany(() => Tag)
  @JoinTable({
    name: "users_tags",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "tag_id" }],
  })
  tags?: Tag[];

  @OneToMany(() => DocumentUserImage, (document) => document.user)
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
