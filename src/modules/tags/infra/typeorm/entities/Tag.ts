import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

@Entity("tags")
class Tag {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

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

export { Tag };
