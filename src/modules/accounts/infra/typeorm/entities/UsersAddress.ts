import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Address } from "./Address";
import { User } from "./User";

@Entity("users_addresses")
class UserAddress {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  address_id: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: "address_id" })
  address: Address;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { UserAddress };
