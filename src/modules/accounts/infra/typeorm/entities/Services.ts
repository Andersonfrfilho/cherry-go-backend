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

import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

@Entity("services")
class Service {
  @PrimaryColumn()
  id?: string;

  @Column()
  tag_id: string;

  @Column()
  amount: string;

  @Column()
  duration: number;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: "tags_services",
    joinColumns: [{ name: "tag_id" }],
    inverseJoinColumns: [{ name: "service_id" }],
  })
  types: Tag[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Service };
