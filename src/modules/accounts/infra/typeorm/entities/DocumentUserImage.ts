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

@Entity("documents_users_images")
class DocumentUserImage {
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

  @Column()
  value: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { DocumentUserImage };
