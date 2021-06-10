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

import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { User } from "./User";

@Entity("users_profiles_images")
class UserProfileImage {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @Column()
  image_id: string;

  @ManyToOne(() => Image, { eager: true })
  @JoinColumn({ name: "image_id", referencedColumnName: "id" })
  image: Image;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { UserProfileImage };
