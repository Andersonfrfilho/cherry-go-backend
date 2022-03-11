import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  getRepository,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { UserPhone } from "./UserPhone";

@Entity("phones")
@Index(["country_code", "ddd", "number"])
class Phone {
  @PrimaryGeneratedColumn("uuid")
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
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;

  @Expose({ name: "active" })
  async active?(): Promise<boolean> {
    const phone_user = await getRepository(UserPhone).findOne({
      where: { phone_id: this.id },
    });
    return phone_user ? phone_user.active : false;
  }
}

export { Phone };
