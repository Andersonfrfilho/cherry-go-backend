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

import { Provider } from "./Providers";

@Entity("services")
class Service {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  amount: string;

  @Column()
  duration: string;

  @ManyToMany(() => Provider)
  @JoinTable({
    name: "providers_services",
    joinColumns: [{ name: "service_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "provider_id", referencedColumnName: "id" }],
  })
  providers?: Provider[];

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: "tags_services",
    joinColumns: [{ name: "service_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "tag_id", referencedColumnName: "id" }],
  })
  tags?: Tag[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Service };
