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

  @Column({ transformer: [lowercase] })
  country: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: "users_addresses",
    joinColumns: [{ name: "address_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
  })
  users?: User[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Address };
