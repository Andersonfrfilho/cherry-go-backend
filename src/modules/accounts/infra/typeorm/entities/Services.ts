import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

@Entity("services")
class Service {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  duration: number;

  @ManyToOne(() => Provider, (provider) => provider.services, {
    eager: true,
  })
  provider?: Provider;

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
