import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Phone } from "@modules/accounts/infra/typeorm/entities/Phone";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("users_phones")
@Index(["user_id", "phone_id"])
class UserPhone {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column()
  phone_id: string;

  @ManyToOne(() => Phone, { eager: true })
  @JoinColumn({ name: "phone_id", referencedColumnName: "id" })
  phone: Phone;

  @Column("boolean", { default: false })
  active: boolean;

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

export { UserPhone };
