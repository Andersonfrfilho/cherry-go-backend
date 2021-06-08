import { Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { config } from "@config/environment";

@Entity("images")
class Image {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Expose({ name: "link" })
  avatar_url?(path: string): string {
    return `${config.storage.base_url}/${path}/${this.name}`;
  }
}

export { Image };
