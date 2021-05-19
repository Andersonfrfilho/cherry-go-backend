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

import { initialUpperCase } from "@utils/initialUppercaseTypeorm";
import { lowercase } from "@utils/lowercaseTypeorm";

import { User } from "./User";

@Entity("addresses")
class Address {
  @PrimaryColumn()
  id?: string;

  @Column({ transformer: [lowercase] })
  street: string;

  @Column()
  number: string;

  @Column()
  zipcode: string;

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
