import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users_types_users")
class UserTypeUser {
  @PrimaryGeneratedColumn("uuid")
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
