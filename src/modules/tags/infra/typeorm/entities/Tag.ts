import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";

@Entity("tags")
class Tag {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

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
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Tag };
