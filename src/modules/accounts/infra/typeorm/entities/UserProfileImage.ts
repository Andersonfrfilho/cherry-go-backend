import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Image } from "@modules/images/infra/typeorm/entities/Image";

import { Provider } from "./Provider";
import { User } from "./User";

@Entity("users_profiles_images")
class UserProfileImage {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  provider?: Provider;

  @Column()
  image_id: string;

  @ManyToOne(() => Image, { eager: true })
  @JoinColumn({ name: "image_id", referencedColumnName: "id" })
  image: Image;

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

export { UserProfileImage };
