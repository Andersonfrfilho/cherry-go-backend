import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { USER_TYPES_ENUM } from "@modules/accounts/enums/UserTypes.enum";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { UserTypeUser } from "./UserTypeUser";

@Entity("types_users")
class TypeUser {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "enum", enum: USER_TYPES_ENUM })
  name: USER_TYPES_ENUM;

  @Column()
  description: string;

  @Column()
  @Exclude()
  active: boolean;

  @OneToMany(() => User, (user) => user.types)
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

export { TypeUser };
