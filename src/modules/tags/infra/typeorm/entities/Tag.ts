import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  active: boolean;

  @Column()
  image_id?: string;

  @ManyToMany(() => Service)
  @JoinTable({
    name: "tags_services",
    joinColumns: [{ name: "tag_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "service_id", referencedColumnName: "id" }],
  })
  services?: Service[];

  @ManyToOne(() => Image, (image) => image.tags, { eager: true })
  @JoinColumn({ name: "image_id", referencedColumnName: "id" })
  image?: Image;

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
