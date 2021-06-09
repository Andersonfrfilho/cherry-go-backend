import { Exclude, Expose } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { config } from "@config/environment";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";

@Entity("images")
class Image {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @OneToMany(() => DocumentUserImage, (document) => document.image)
  documents?: DocumentUserImage[];

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
