import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users_types_users")
class UserTypeUser {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  user_type_id: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { UserTypeUser };
