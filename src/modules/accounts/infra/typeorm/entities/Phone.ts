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

@Entity("phones")
class Phone {
  @PrimaryColumn()
  id?: string;

  @Column()
  country_code: string;

  @Column()
  ddd: string;

  @Column()
  number: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: "users_phones",
    joinColumns: [{ name: "phone_id", referencedColumnName: "id" }],
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

export { Phone };
