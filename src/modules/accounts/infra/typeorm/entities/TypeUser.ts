import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserTypes } from "@modules/accounts/enums/UserTypes.enum";
import { lowercase } from "@utils/lowercaseTypeorm";

import { User } from "./User";

@Entity("types_users")
class TypeUser {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "enum", enum: UserTypes, transformer: [lowercase] })
  name: UserTypes;

  @Column()
  description: string;

  @Column()
  @Exclude()
  active: boolean;

  @ManyToMany(() => User, (user) => user.types)
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
