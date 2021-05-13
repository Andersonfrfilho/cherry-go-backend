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

import { User } from "./User";

@Entity("types_users")
class TypeUser {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  active: boolean;

  @ManyToMany((type) => User, (user) => user.types)
  users?: User[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { TypeUser };
