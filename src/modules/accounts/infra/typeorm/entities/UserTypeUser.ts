import { Exclude } from "class-transformer";
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

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("users_types_users")
class UserTypeUser {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @Column()
  user_type_id: string;

  @ManyToOne(() => TypeUser, { eager: true })
  @JoinColumn({ name: "user_type_id", referencedColumnName: "id" })
  user_type?: TypeUser;

  @Column()
  active: boolean;

  @Column("varchar", { array: true })
  roles?: string[];

  @Column("varchar", { array: true })
  permissions?: string[];

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

export { UserTypeUser };
