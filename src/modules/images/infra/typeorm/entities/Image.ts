import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { config } from "@config/environment";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserProfileImage } from "@modules/accounts/infra/typeorm/entities/UserProfileImage";

@Entity("images")
class Image {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @OneToMany(() => DocumentUserImage, (document) => document.image)
  documents?: DocumentUserImage[];

  @OneToMany(
    () => UserProfileImage,
    (user_profile_image) => user_profile_image.image
  )
  image_profile?: UserProfileImage[];

  @ManyToMany(() => User)
  @JoinTable({
    name: "users_profiles_images",
    joinColumns: [{ name: "image_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
  })
  user_profile?: User[];

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;

  @Expose({ name: "link" })
  avatar_url?(path: string): string {
    return `${config.storage.base_url}/${path}/${this.name}`;
  }
}

export { Image };
