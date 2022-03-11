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

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

@Entity("users_addresses")
class UserAddress {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column()
  address_id: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: "address_id", referencedColumnName: "id" })
  address: Address;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { UserAddress };
