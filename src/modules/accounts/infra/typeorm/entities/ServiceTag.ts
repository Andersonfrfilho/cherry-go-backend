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

import { Service } from "@modules/accounts/infra/typeorm/entities/Services";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

@Entity("tags_services")
export class TagService {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  tag_id: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tag_id", referencedColumnName: "id" })
  tag: Tag;

  @Column()
  service_id: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "service_id", referencedColumnName: "id" })
  service: Service;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
